import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { GetUser } from 'src/decorator/user-data.decorator';
import { JwtPayload } from 'src/dto/jwt-payload.dto';
import { NewTransactionDto } from 'src/dto/new-transaction.dto';
import { TransactionService } from 'src/service/transaction.service';

@Controller('transactions')
export class TransactionController {
  constructor(
    @Inject(TransactionService)
    private readonly transactionService: TransactionService,
  ) {}
  @Post()
  async addTransaction(
    @Body() userTransaction: NewTransactionDto,
    @GetUser() jwtPayload: JwtPayload,
  ) {
    return await this.transactionService.addTransaction(
      userTransaction,
      jwtPayload,
    );
  }

  @Get('/:id')
  async getTransactionById(
    @Param('id') id: string,
    @GetUser() jwtPayload: JwtPayload,
  ) {
    return await this.transactionService.getTransactionById(id, jwtPayload);
  }

  @Put('/:id')
  async updateTransactionById(
    @Param('id') id: string,
    @GetUser() jwtPayload: JwtPayload,
    @Body() userTransaction: Partial<NewTransactionDto>,
  ) {
    return await this.transactionService.updateTransactionById(
      id,
      jwtPayload,
      userTransaction,
    );
  }

  @Delete('/:id')
  async deleteTransactionById(
    @Param('id') id: string,
    @GetUser() jwtPayload: JwtPayload,
  ) {}
}
