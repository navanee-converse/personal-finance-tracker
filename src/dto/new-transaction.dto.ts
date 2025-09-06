import {
  IsDate,
  IsDefined,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TransactionTypes } from 'src/enum/transaction.type';

export class NewTransactionDto {
  @IsDefined()
  @IsNumber()
  amount: number;

  @IsDefined()
  @IsEnum(TransactionTypes)
  type: TransactionTypes;

  @IsDefined()
  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDate()
  transaction_date?: Date;
}

export class TransactionData {
  id: string;
  amount: number;
  type: TransactionTypes;
  category: string;
  description?: string;
  transaction_date: Date;
  created_at: Date;
}
