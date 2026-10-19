import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { CurrencyModule } from '../currency/currency.module';
import { TripModule } from '../trip/trip.module';
import { ExpenseParticipant } from './entities/expense-participant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Expense, ExpenseParticipant]), CurrencyModule, TripModule],
  controllers: [ExpenseController],
  providers: [ExpenseService],
})
export class ExpenseModule {}
