import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass, plainToInstance } from 'class-transformer';
import { JwtPayload } from 'src/dto/jwt-payload.dto';
import {
  NewTransactionDto,
  TransactionData,
} from 'src/dto/new-transaction.dto';
import { APIResponse } from 'src/dto/response.dto';
import { Transaction } from 'src/entity/transaction.entity';
import { User } from 'src/entity/user.entity';
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

  async getTransactionById(
    id: string,
    jwtPayload: JwtPayload,
  ): Promise<APIResponse<TransactionData>> {
    await this.validateUser(jwtPayload);
    const transaction = await this.transactionRepo.findOne({
      where: { id: id },
    });
    if (!transaction) throw new BadRequestException('Invalid Transaction Id');
    let transactionData = plainToInstance(TransactionData, transaction);

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
    await this.validateUser(jwtPayload);
    let transaction = await this.transactionRepo.findOne({
      where: { id: id },
    });
    if (!transaction) throw new BadRequestException('Invalid Transaction Id');
    const updateTransaction = plainToInstance(
      TransactionData,
      await this.transactionRepo.update(id, userTransaction),
    );
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Transaction updated successfully by Id',
      data: updateTransaction,
    };
  }

  private async validateUser(jwtPayload: JwtPayload): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id: jwtPayload.id } });
    if (!user) throw new NotFoundException('User not found or invalid user');
    else return user;
  }
}
