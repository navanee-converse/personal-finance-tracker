import { Module } from '@nestjs/common';
import { FinanceTrackerModule } from './module/finance-tracker.module';
import { AuthModule } from './module/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOption } from './entity/data-source/data-source';

@Module({
  imports: [FinanceTrackerModule, AuthModule, ConfigModule.forRoot({isGlobal: true}), TypeOrmModule.forRoot({dataSourceOption})],
})
export class AppModule {}
