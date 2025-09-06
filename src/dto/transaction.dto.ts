import {
  IsDate,
  IsDecimal,
  IsDefined,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { TransactionTypes } from 'src/enum/transaction.type';

export class TransactionDto {
  @IsDefined({ message: 'Please enter the value for field amount' })
  @IsDecimal(
    { decimal_digits: '5' },
    { message: 'Please enter amount not exceed 5 decimal places' },
  )
  amount: number;

  @IsDefined({ message: 'Please enter the value for field type' })
  @IsEnum(TransactionTypes)
  type: TransactionTypes;

  @IsDefined({ message: 'Please enter the value for field category' })
  @IsString()
  category: string;
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDate()
  transaction_date?: Date;
}
