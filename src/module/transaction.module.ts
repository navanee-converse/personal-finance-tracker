import { Module } from '@nestjs/common';
import { TransactionController } from '../controller/transaction.controller';
import { TransactionService } from '../service/transaction.service';

@Module({
  controllers: [TransactionController],
  providers: [TransactionModule],
})
export class TransactionModule {}
