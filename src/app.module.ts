import { Module } from '@nestjs/common';
import { FinanceTrackerModule } from './module/finance-tracker.module';
import { AuthModule } from './module/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Transaction } from './entity/transaction.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      secret: process.env.SECRETE_KEY,
      signOptions: {
        expiresIn: process.env.EXPIRATION_TIME,
      },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.HOST || 'localhost',
      port: Number(process.env.PORT) || 3306,
      username: process.env.USER || 'root',
      password: process.env.PASSWORD || 'admin',
      database: process.env.DATABASE || 'finance_tracker',
      entities: [User, Transaction],
      synchronize: true,
      logging: true,
    }),
    FinanceTrackerModule,
    AuthModule,
  ],
})
export class AppModule {}
