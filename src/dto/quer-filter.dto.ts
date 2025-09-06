import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { TransactionTypes } from 'src/enum/transaction.type';

export class QueryFilter {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsEnum(TransactionTypes)
  type?: TransactionTypes;

  @IsOptional()
  @IsNumber()
  pageNumber?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;
}
