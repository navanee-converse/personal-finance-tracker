import { Module } from '@nestjs/common';
import { FinanceTrackerModule } from './module/finance-tracker.module';
import { AuthModule } from './module/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Transaction } from './entity/transaction.entity';
import { JwtModule } from '@nestjs/jwt';

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
      type: 'postgres',
      port: Number(process.env.PORT),
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      entities: [User, Transaction],
      synchronize: true,
      logging: true,
    }),
    FinanceTrackerModule,
    AuthModule,
  ],
})
export class AppModule {}
