import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { TransactionTypes } from 'src/enum/transaction.type';
import 'reflect-metadata';

@Entity({ name: 'transactions' })
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user_id) => user_id.user_transaction)
  @JoinColumn({name: 'user_id'})
  user_id: User;

  @Column({ type: 'decimal', scale: 5, precision: 10 })
  amount: string;

  @Column({ type: 'enum', enum: TransactionTypes })
  type: TransactionTypes;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'timestamp', default: () => 'current_timestamp' })
  transaction_date: Date;

  @CreateDateColumn()
  created_at: string;
}
