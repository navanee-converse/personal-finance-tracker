import { DataSource } from 'typeorm';
import { User } from '../user.entity';
import { Transaction } from '../transaction.entity';

export const dataSourceOption = new DataSource({
  type: 'mysql',
  port: Number(process.env.PORT),
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  entities: [User, Transaction],
  synchronize: false,
  logging: true,
});
