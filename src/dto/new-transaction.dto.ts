import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ example: 50.5 })
  amount: number;

  @IsDefined()
  @IsEnum(TransactionTypes)
  @ApiProperty({ example: TransactionTypes.Expense })
  type: TransactionTypes;

  @IsDefined()
  @IsString()
  @ApiProperty({ example: 'food' })
  category: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Expense on food' })
  description?: string;

  @IsOptional()
  @IsDate()
  @ApiProperty({ example: '2025' })
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
