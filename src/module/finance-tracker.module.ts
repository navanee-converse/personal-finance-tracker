import { Module } from '@nestjs/common';
import { FinanceTrackerController } from '../controller/finance-tracker.controller';
import { FinanceTrackerService } from '../service/finance-tracker.service';

@Module({
  controllers: [FinanceTrackerController],
  providers: [FinanceTrackerService],
})
export class FinanceTrackerModule {}
