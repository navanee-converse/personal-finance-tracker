import { Module } from '@nestjs/common';
import { TransactionController } from '../controller/transaction.controller';
import { TransactionService } from '../service/transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Transaction } from 'src/entity/transaction.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User, Transaction])],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
