import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { TransactionTypes } from 'src/enum/transaction.type';

@Entity({ name: 'transactions' })
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  @ManyToOne(() => User, (user) => user.user_transaction)
  user_id: User;

  @Column({ type: 'decimal', scale: 10, precision: 5 })
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
