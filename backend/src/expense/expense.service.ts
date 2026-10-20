import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { Repository } from 'typeorm';
import { TripService } from '../trip/trip.service';
import { Currency, CurrencyService } from '../currency/currency.service';
import { ExpenseResponseDto } from './dto/expense-response.dto';
import { ExpenseParticipant } from './entities/expense-participant.entity';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense) 
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
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

  private splitAmount(baseAmount: number, participants: number[]): ExpenseParticipant[] {
    const count = participants.length;
    if (count === 0) return [];

    const baseShare = Math.floor(baseAmount / count);
    const remainder = baseAmount % count;

    return participants.map((id, index) => {
      const extra = index < remainder ? 1 : 0;
      return {
        userId: id,
        amount: baseShare + extra,
      } as ExpenseParticipant;
    });
  }

  async create(tripId: number, userId: number, createExpenseDto: CreateExpenseDto): Promise<ExpenseResponseDto> {
    const trip = await this.tripService.ensureTripAccess(tripId, userId);

    const { amount, participantIds, ...rest } = createExpenseDto;
    const amountMinor = this.toMinor(amount, createExpenseDto.currency);
    const base = this.currencyService.get(trip.baseCurrency);

    const uniqueParticipantIds = [...new Set([userId, ...(participantIds ?? [])])];
    this.tripService.assertMembers(trip, uniqueParticipantIds);

    const baseAmountMinor = this.toBaseMinor(amountMinor, createExpenseDto.currency, base, createExpenseDto.exchangeRate!);
    const participantsArray = this.splitAmount(baseAmountMinor, uniqueParticipantIds);

    const newExpense = this.expenseRepository.create({
      ...rest,
      paidAt: new Date(createExpenseDto.paidAt),
      tripId,
      paidById: userId,
      amountMinor,
      baseAmountMinor,
      participants: participantsArray
    });

    const savedExpense = await this.expenseRepository.save(newExpense);
    const expense = await this.expenseRepository.findOneOrFail({
        where: { id: savedExpense.id },
        relations: { paidBy: true, participants: { user: true } },
    });

    const minorUnits = this.currencyService.get(createExpenseDto.currency).minorUnits;
    return new ExpenseResponseDto(expense, minorUnits, base);
    
  }

  async findAll(tripId: number, userId: number): Promise<ExpenseResponseDto[]> {
    const trip = await this.tripService.ensureTripAccess(tripId, userId);
    const expenses = await this.expenseRepository.find({
      where: { tripId },
      relations: { participants: { user: true }, paidBy: true }
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
      relations: { participants: { user: true }, paidBy: true }
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
      relations: { participants: true, paidBy: true },
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

    let amountChanged = false;
    if (amount !== undefined || newCurrency !== expense.currency || newRate !== expense.exchangeRate) {
      if (amount !== undefined) expense.amountMinor = this.toMinor(amount, newCurrency);
      expense.baseAmountMinor = this.toBaseMinor(expense.amountMinor, newCurrency, base, newRate);
      expense.exchangeRate = newRate;
      amountChanged = true;
    }
    expense.currency = newCurrency;

    let currentParticipantIds: number[];
    let participantsChanged = false;

    if (participantIds) {
      currentParticipantIds = [...new Set([expense.paidById, ...participantIds])];
      this.tripService.assertMembers(trip, currentParticipantIds);
      participantsChanged = true;
    } else {
      currentParticipantIds = expense.participants.map((p) => p.userId);
    }

    if (amountChanged || participantsChanged) {
      expense.participants = this.splitAmount(expense.baseAmountMinor, currentParticipantIds);
    }

    const saved = await this.expenseRepository.save(expense);
    const reloaded = await this.expenseRepository.findOneOrFail({
      where: { id },
      relations: { paidBy: true, participants: { user: true } },
    });
    const { minorUnits } = this.currencyService.get(saved.currency);

    return new ExpenseResponseDto(reloaded, minorUnits, base);
  }

  async remove(tripId: number, userId: number, id: number) {
    await this.tripService.ensureTripAccess(tripId, userId);
    const expense = await this.expenseRepository.findOneBy({ id });
    if (!expense) throw new NotFoundException('Expense not found');
    await this.expenseRepository.delete(id);
  }

  async createPayment(tripId: number, userId: number, createPaymentDto: CreatePaymentDto): Promise<PaymentResponseDto> {
    const trip = await this.tripService.ensureTripAccess(tripId, userId);
    const { toUserId, amount } = createPaymentDto;

    if (userId === toUserId) throw new BadRequestException('Cannot pay yourself');
    this.tripService.assertMembers(trip, [ toUserId ]);

    const base = this.currencyService.get(trip.baseCurrency);
    const amountMinor = this.toMinor(amount, trip.baseCurrency);

    const saved = await this.paymentRepository.save(
      this.paymentRepository.create({ tripId, fromUserId: userId, toUserId, amountMinor }),
    );

    const payment = await this.paymentRepository.findOneOrFail({
      where: { id: saved.id },
      relations: { fromUser: true, toUser: true },
    });
    return new PaymentResponseDto(payment, base);
  }

  async findPayments(tripId: number, userId: number): Promise<PaymentResponseDto[]> {
    const trip = await this.tripService.ensureTripAccess(tripId, userId);
    const base = this.currencyService.get(trip.baseCurrency);
    const payments = await this.paymentRepository.find({
      where: { tripId },
      relations: { fromUser: true, toUser: true },
      order: { createdAt: 'DESC' },
    });
    return payments.map((p) => new PaymentResponseDto(p, base));
  }

  async removePayment(tripId: number, userId: number, id: number) {
    await this.tripService.ensureTripAccess(tripId, userId);
    const payment = await this.paymentRepository.findOneBy({ id, tripId });
    if (!payment || (payment.fromUserId !== userId && payment.toUserId !== userId)) throw new NotFoundException('Payment not found');
    await this.paymentRepository.delete(id);
  }
}
