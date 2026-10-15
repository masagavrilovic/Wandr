import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { Repository } from 'typeorm';
import { TripService } from '../trip/trip.service';
import { CurrencyService } from '../currency/currency.service';
import { ExpenseResponseDto } from './dto/expense-response.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense) 
    private readonly expenseRepository: Repository<Expense>,
    private readonly tripService: TripService,
    private readonly currencyService: CurrencyService,
  ) {}

  toMinor(amount: number, code: string): number {
    const { minorUnits } = this.currencyService.get(code);
    const scaled = Number((amount * 10 ** minorUnits).toPrecision(15));
    const minor = Math.round(scaled);

    if (Math.abs(scaled - minor) > 1e-9) throw new BadRequestException(`${code} supports at most ${minorUnits} decimal places`);
    if (!Number.isSafeInteger(minor) || minor <= 0) throw new BadRequestException('Invalid amount');
    return minor;
  }

  async create(tripId: number, userId: number, createExpenseDto: CreateExpenseDto): Promise<ExpenseResponseDto> {
    const trip = await this.tripService.ensureTripAccess(tripId, userId);
    if (!!createExpenseDto.participantIds) await this.tripService.assertMembers(trip, createExpenseDto.participantIds);

    const { amount, participantIds, ...rest } = createExpenseDto;
    const newExpense = this.expenseRepository.create({
      ...rest,
      paidAt: new Date(createExpenseDto.paidAt),
      tripId,
      paidById: userId,
      amountMinor: this.toMinor(amount, createExpenseDto.currency),
      participants: participantIds?.map((id) => ({ id }))
    });

    const savedExpense = await this.expenseRepository.save(newExpense);
    const minorUnits = this.currencyService.get(createExpenseDto.currency).minorUnits;
    return new ExpenseResponseDto(savedExpense, minorUnits);
    
  }

  async findAll(tripId: number, userId: number): Promise<ExpenseResponseDto[]> {
    await this.tripService.ensureTripAccess(tripId, userId);
    const expenses = await this.expenseRepository.find({
      where: { tripId },
      relations: { participants: true }
    });
    
    return expenses.map((expense) => {
      const minorUnits = this.currencyService.get(expense.currency).minorUnits;
      return new ExpenseResponseDto(expense, minorUnits)
    });
  }

  async findOne(tripId: number, userId: number, id: number): Promise<ExpenseResponseDto> {
    await this.tripService.ensureTripAccess(tripId, userId);
    const expense = await this.expenseRepository.findOne({ 
      where: { id },
      relations: { participants: true }
     });
    if (!expense) throw new NotFoundException('Expense not found');

    const minorUnits = this.currencyService.get(expense.currency).minorUnits;
    return new ExpenseResponseDto(expense, minorUnits);
  }

  async update(tripId: number, userId: number, id: number, updateExpenseDto: UpdateExpenseDto): Promise<ExpenseResponseDto> {
    const trip = await this.tripService.ensureTripAccess(tripId, userId);
    const expense = await this.expenseRepository.findOne({
      where: { id },
      relations: { participants: true }
    });
    if (!expense) throw new NotFoundException('Expense not found');

    const { amount, currency, participantIds, paidAt, description } = updateExpenseDto;
    if (description !== undefined) expense.description = description;
    if (paidAt) expense.paidAt = new Date(paidAt);
    const newCurrency = currency ?? expense.currency;
    if (newCurrency !== expense.currency && amount === undefined) {
      throw new BadRequestException('Amount is required when changing currency');
    }
    if (amount !== undefined) expense.amountMinor = this.toMinor(amount, newCurrency);
    expense.currency = newCurrency;

    if (participantIds) {
      const unique = [...new Set(participantIds)];
      this.tripService.assertMembers(trip, unique);
      expense.participants = unique.map((uid) => ({ id: uid }) as User);
    }

    const saved = await this.expenseRepository.save(expense);
    const { minorUnits } = this.currencyService.get(saved.currency);
    return new ExpenseResponseDto(saved, minorUnits);
  }

  async remove(tripId: number, userId: number, id: number) {
    await this.tripService.ensureTripAccess(tripId, userId);
    const expense = await this.expenseRepository.findOneBy({ id });
    if (!expense) throw new NotFoundException('Expense not found');
    await this.expenseRepository.delete(id);
  }
}
