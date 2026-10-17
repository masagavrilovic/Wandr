import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { Repository } from 'typeorm';
import { TripService } from '../trip/trip.service';
import { Currency, CurrencyService } from '../currency/currency.service';
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

  private toBaseMinor(amountMinor: number, from: string, base: Currency, rate: number): number {
    const result = this.currencyService.convertMinor(amountMinor, this.currencyService.get(from), base, rate);
    if (!Number.isSafeInteger(result)) throw new BadRequestException('Invalid amount');
    if (result < 1) {
      throw new BadRequestException('Amount is too small to be converted to the trip currency');
    }
    return result;
  }

  async create(tripId: number, userId: number, createExpenseDto: CreateExpenseDto): Promise<ExpenseResponseDto> {
    const trip = await this.tripService.ensureTripAccess(tripId, userId);
    if (!!createExpenseDto.participantIds) await this.tripService.assertMembers(trip, createExpenseDto.participantIds);

    const { amount, participantIds, ...rest } = createExpenseDto;
    const amountMinor = this.toMinor(amount, createExpenseDto.currency);
    const base = this.currencyService.get(trip.baseCurrency);

    const newExpense = this.expenseRepository.create({
      ...rest,
      paidAt: new Date(createExpenseDto.paidAt),
      tripId,
      paidById: userId,
      amountMinor,
      baseAmountMinor: this.toBaseMinor(amountMinor, createExpenseDto.currency, base, createExpenseDto.exchangeRate!),
      participants: participantIds?.map((id) => ({ id }))
    });

    const savedExpense = await this.expenseRepository.save(newExpense);
    const minorUnits = this.currencyService.get(createExpenseDto.currency).minorUnits;
    return new ExpenseResponseDto(savedExpense, minorUnits, base);
    
  }

  async findAll(tripId: number, userId: number): Promise<ExpenseResponseDto[]> {
    const trip = await this.tripService.ensureTripAccess(tripId, userId);
    const expenses = await this.expenseRepository.find({
      where: { tripId },
      relations: { participants: true, paidBy: true }
    });
    
    return expenses.map((expense) => {
      const minorUnits = this.currencyService.get(expense.currency).minorUnits;
      const base = this.currencyService.get(trip.baseCurrency);
      return new ExpenseResponseDto(expense, minorUnits, base)
    });
  }

  async findOne(tripId: number, userId: number, id: number): Promise<ExpenseResponseDto> {
    const trip = await this.tripService.ensureTripAccess(tripId, userId);
    const expense = await this.expenseRepository.findOne({ 
      where: { id },
      relations: { participants: true }
     });
    if (!expense) throw new NotFoundException('Expense not found');

    const minorUnits = this.currencyService.get(expense.currency).minorUnits;
    const base = this.currencyService.get(trip.baseCurrency);
    return new ExpenseResponseDto(expense, minorUnits, base);
  }

  async update(tripId: number, userId: number, id: number, updateExpenseDto: UpdateExpenseDto): Promise<ExpenseResponseDto> {
    const trip = await this.tripService.ensureTripAccess(tripId, userId);
    const expense = await this.expenseRepository.findOne({
      where: { id },
      relations: { participants: true },
    });
    if (!expense) throw new NotFoundException('Expense not found');

    const base = this.currencyService.get(trip.baseCurrency);
    const { amount, currency, participantIds, paidAt, description, exchangeRate, category } = updateExpenseDto;

    if (description !== undefined) expense.description = description;
    if (paidAt) expense.paidAt = new Date(paidAt);
    if (category !== undefined) expense.category = category;

    const newCurrency = currency ?? expense.currency;
    if (newCurrency !== expense.currency && amount === undefined) {
      throw new BadRequestException('Amount is required when changing currency');
    }

    const newRate = newCurrency === trip.baseCurrency ? 1 : (exchangeRate ?? expense.exchangeRate);
    if (amount !== undefined || newCurrency !== expense.currency || newRate !== expense.exchangeRate) {
      if (amount !== undefined) expense.amountMinor = this.toMinor(amount, newCurrency);
      expense.baseAmountMinor = this.toBaseMinor(expense.amountMinor, newCurrency, base, newRate);
      expense.exchangeRate = newRate;
    }
    expense.currency = newCurrency;

    if (participantIds) {
      const unique = [...new Set(participantIds)];
      this.tripService.assertMembers(trip, unique);
      expense.participants = unique.map((uid) => ({ id: uid }) as User);
    }

    const saved = await this.expenseRepository.save(expense);
    const { minorUnits } = this.currencyService.get(saved.currency);

    return new ExpenseResponseDto(saved, minorUnits, base);
  }

  async remove(tripId: number, userId: number, id: number) {
    await this.tripService.ensureTripAccess(tripId, userId);
    const expense = await this.expenseRepository.findOneBy({ id });
    if (!expense) throw new NotFoundException('Expense not found');
    await this.expenseRepository.delete(id);
  }
}
