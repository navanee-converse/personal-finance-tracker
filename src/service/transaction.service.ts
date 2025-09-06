import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { JwtPayload } from 'src/dto/jwt-payload.dto';
import {
  NewTransactionDto,
  TransactionData,
} from 'src/dto/new-transaction.dto';
import { QueryFilter } from 'src/dto/quer-filter.dto';
import { APIResponse } from 'src/dto/response.dto';
import { TransactionSummary } from 'src/dto/transaction-summary.dto';
import { Transaction } from 'src/entity/transaction.entity';
import { User } from 'src/entity/user.entity';
import { TransactionTypes } from 'src/enum/transaction.type';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
  ) {}

  async addTransaction(
    userTransaction: NewTransactionDto,
    jwtPayload: JwtPayload,
  ): Promise<APIResponse<Partial<Transaction>>> {
    const user = await this.validateUser(jwtPayload);

    const createTransaction = this.transactionRepo.create({
      ...userTransaction,
      user_id: user,
    });

    const transaction = plainToInstance(
      TransactionData,
      await this.transactionRepo.save(createTransaction),
    );

    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      data: transaction,
    };
  }

  async getAllTransaction(
    jwtPayload: JwtPayload,
    queryFilter: QueryFilter,
  ): Promise<APIResponse<Transaction[]>> {
    await this.validateUser(jwtPayload);
    let { pageNumber, limit, ...query } = queryFilter;
    pageNumber = pageNumber ? pageNumber : 1;
    limit = limit ? limit : 10;
    const skip = (pageNumber - 1) * limit;
    const result = await this.transactionRepo.findAndCount({
      where: { ...query },
      take: limit,
      skip: skip,
      order: { id: 'ASC' },
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: result[0],
      currentPage: Number(pageNumber),
      numberOfData: result[1],
    };
  }

  async getSummary(
    jwtPayload: JwtPayload,
  ): Promise<APIResponse<TransactionSummary>> {
    const transactions = await this.transactionRepo.find({
      where: { user_id: { id: jwtPayload.id } },
    });

    let total_income: number = 0;
    let total_expense: number = 0;
    let balance: number = 0;
    let transaction_count: number = 0;

    if (transactions.length == 0)
      throw new NotFoundException('No data found or Transaction deleted');
    else {
      transactions.forEach((transaction) => {
        const amount = Number(transaction.amount);
        if (transaction.type == TransactionTypes.Income) {
          total_income += amount;
          balance += amount;
        } else {
          total_expense += amount;
          balance -= amount;
        }
        transaction_count++;
      });

      return {
        success: true,
        statusCode: HttpStatus.OK,
        data: { total_income, total_expense, balance, transaction_count },
      };
    }
  }

  async getTransactionById(
    id: string,
    jwtPayload: JwtPayload,
  ): Promise<APIResponse<TransactionData>> {
    const user = await this.validateUser(jwtPayload);
    const transaction = await this.transactionRepo.findOne({
      where: { id: id },
      relations: { user_id: true },
    });

    if (user.id != transaction?.user_id?.id)
      throw new UnauthorizedException('Unauthorized access to get data by Id');
    if (!transaction) throw new BadRequestException('Invalid Transaction Id');
    let { user_id, ...transactionData } = transaction;

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Transaction fetched successfully by Id',
      data: transactionData,
    };
  }

  async updateTransactionById(
    id: string,
    jwtPayload: JwtPayload,
    userTransaction: Partial<NewTransactionDto>,
  ): Promise<APIResponse<TransactionData>> {
    const user = await this.validateUser(jwtPayload);
    let transaction = await this.transactionRepo.findOne({
      where: { id: id },
      relations: { user_id: true },
    });

    if (user.id != transaction?.user_id.id)
      throw new UnauthorizedException(
        'Unauthorized access to update data by Id',
      );

    if (!transaction) throw new BadRequestException('Invalid Transaction Id');

    if (!userTransaction) {
      throw new BadRequestException(
        'All fields are empty please fill minimum one field',
      );
    }
    const update = await this.transactionRepo.update(id, userTransaction);
    const updateData = await this.transactionRepo.findOne({
      where: { id: id },
    });

    if (update.affected && updateData && update.affected > 0) {
      const { user_id, ...data } = updateData;
      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Transaction updated successfully by Id',
        data,
      };
    } else {
      throw new BadRequestException('Data already updated or empty data');
    }
  }

  async deleteTransactionById(
    id: string,
    jwtPayload: JwtPayload,
  ): Promise<APIResponse<unknown>> {
    const user = await this.validateUser(jwtPayload);
    let transaction = await this.transactionRepo.findOne({
      where: { id: id },
      relations: { user_id: true },
    });
    let response: APIResponse<unknown> = {
      success: true,
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Transaction data is already deleted',
    };

    if (!transaction) {
      return response;
    }
    if (user.id != transaction?.user_id.id)
      throw new UnauthorizedException(
        'Unauthorized access to update data by Id',
      );

    await this.transactionRepo.delete(id);
    response.message = 'Transaction data deleted successfully';
    return response;
  }

  private async validateUser(jwtPayload: JwtPayload): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id: jwtPayload.id } });
    if (!user) throw new NotFoundException('User not found or invalid user');
    else return user;
  }
}
