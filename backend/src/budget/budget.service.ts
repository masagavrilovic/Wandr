import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThan, Repository } from 'typeorm';
import { Currency, CurrencyService } from '../currency/currency.service';
import { TripService } from '../trip/trip.service';
import { User } from '../user/entities/user.entity';
import { CreatePaymentDto } from './dto/payments/create-payment.dto';
import { UpdatePaymentDto } from './dto/payments/update-payment.dto';
import { ExpenseParticipant } from './entities/expense-participant.entity';
import { Expense, ExpenseCategory } from './entities/expense.entity';
import { Payment } from './entities/payment.entity';
import { computeSettlements } from './settlement.util';
import { CreateExpenseDto } from './dto/expenses/create-expense.dto';
import { ExpenseResponseDto } from './dto/expenses/expense-response.dto';
import { UpdateExpenseDto } from './dto/expenses/update-expense.dto';
import { PaymentResponseDto } from './dto/payments/payment-response.dto';
import { SettlementResponseDto, BalanceDto, SettlementTransactionDto } from './dto/summary/settlement-response.dto';
import { CursorPaginationQueryDto } from '../common/dto/cursor-pagination.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { CategorySpendingDto, SpendingByCategoryResponseDto } from './dto/summary/category-summary.dto';
import { FindExpensesQueryDto } from './dto/expenses/find-expenses.dto';

type SumRow = { userId: number, total: string };

@Injectable()
export class BudgetService {
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

    const { amount, participantIds, exchangeRate, ...rest } = createExpenseDto;
    const rate = rest.currency === trip.baseCurrency ? 1 : exchangeRate;
    const amountMinor = this.toMinor(amount, rest.currency);
    const base = this.currencyService.get(trip.baseCurrency);

    const uniqueParticipantIds = [...new Set([userId, ...(participantIds ?? [])])];
    this.tripService.assertMembers(trip, uniqueParticipantIds);

    const baseAmountMinor = this.toBaseMinor(amountMinor, rest.currency, base, rate);
    const participantsArray = this.splitAmount(baseAmountMinor, uniqueParticipantIds);

    const newExpense = this.expenseRepository.create({
      ...rest,
      paidAt: new Date(createExpenseDto.paidAt),
      tripId,
      paidById: userId,
      amountMinor,
      baseAmountMinor,
      exchangeRate: rate,
      participants: participantsArray
    });

    const savedExpense = await this.expenseRepository.save(newExpense);
    const expense = await this.expenseRepository.findOneOrFail({
        where: { id: savedExpense.id },
        relations: { paidBy: true, participants: { user: true } },
    });

    const minorUnits = this.currencyService.get(expense.currency).minorUnits;
    return new ExpenseResponseDto(expense, minorUnits, base);
    
  }

  async findAll(tripId: number, userId: number, query: FindExpensesQueryDto): Promise<PaginatedResponseDto<ExpenseResponseDto>> {
    const trip = await this.tripService.ensureTripAccess(tripId, userId);
    const base = this.currencyService.get(trip.baseCurrency);

    const { cursor, limit = 10, category } = query;

     const expenses = await this.expenseRepository.find({
      where: {
        tripId,
        ...(cursor ? { id: LessThan(cursor) } : {}),
        ...(category?.length ? { category } : {}),
      },
      relations: { participants: { user: true }, paidBy: true },
      order: { id: 'DESC' },
      take: limit + 1,
    });

    const hasNextPage = expenses.length > limit;
    if (hasNextPage) expenses.pop();
    
    let nextCursor: number | null = null;
    if (hasNextPage && expenses.length > 0) nextCursor = expenses[expenses.length - 1].id;

    const data = expenses.map((expense) => {
      const minorUnits = this.currencyService.get(expense.currency).minorUnits;
      return new ExpenseResponseDto(expense, minorUnits, base);
    });

    return new PaginatedResponseDto(data, nextCursor, hasNextPage);
  }

  async findOne(tripId: number, userId: number, id: number): Promise<ExpenseResponseDto> {
    const trip = await this.tripService.ensureTripAccess(tripId, userId);
    const expense = await this.expenseRepository.findOne({ 
      where: { id, tripId },
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
      where: { id, tripId },
      relations: { participants: true, paidBy: true },
    });
    if (!expense) throw new NotFoundException('Expense not found');

    const base = this.currencyService.get(trip.baseCurrency);
    const { amount, currency, participantIds, paidAt, description, exchangeRate, category } = updateExpenseDto;

    if (description !== undefined) expense.description = description;
    if (paidAt) expense.paidAt = new Date(paidAt);
    if (category !== undefined) expense.category = category;

    const newCurrency = currency ?? expense.currency;
    const currencyChanged = newCurrency !== expense.currency;
    if (currencyChanged && amount === undefined) {
      throw new BadRequestException('Amount is required when changing currency');
    }
    if (currencyChanged && newCurrency !== trip.baseCurrency && exchangeRate === undefined) {
      throw new BadRequestException('Exchange rate is required when changing currency');
    }

    const newRate = newCurrency === trip.baseCurrency ? 1 : (exchangeRate ?? expense.exchangeRate);

    let amountChanged = false;
    if (amount !== undefined || currencyChanged || newRate !== expense.exchangeRate) {
      if (amount !== undefined) expense.amountMinor = this.toMinor(amount, newCurrency);
      expense.baseAmountMinor = this.toBaseMinor(expense.amountMinor, newCurrency, base, newRate!);
      expense.exchangeRate = newRate!;
      amountChanged = true;
    }
    expense.currency = newCurrency;

    let currentParticipantIds: number[];
    let participantsChanged = false;

    if (participantIds) {
      currentParticipantIds = [...new Set([expense.paidById, ...participantIds])];
      const existingIds = new Set(expense.participants.map((p) => p.userId));

      this.tripService.assertMembers(trip, currentParticipantIds.filter((id) => !existingIds.has(id)));
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
    const expense = await this.expenseRepository.findOneBy({ id, tripId });
    if (!expense) throw new NotFoundException('Expense not found');
    await this.expenseRepository.delete(id);
  }

  private async loadPayment(id: number): Promise<Payment> {
    return this.paymentRepository.findOneOrFail({
      where: { id },
      relations: { fromUser: true, toUser: true },
    });
  }

  private toPaymentDto(payment: Payment, base: Currency): PaymentResponseDto {
    const { minorUnits } = this.currencyService.get(payment.currency);
    return new PaymentResponseDto(payment, minorUnits, base);
  }

  async createPayment(tripId: number, userId: number, createPaymentDto: CreatePaymentDto): Promise<PaymentResponseDto> {
    const trip = await this.tripService.ensureTripAccess(tripId, userId);
    const { toUserId, amount, currency, paidAt, exchangeRate } = createPaymentDto;

    if (userId === toUserId) throw new BadRequestException('Cannot pay yourself');
    this.tripService.assertMembers(trip, [ toUserId ]);

    const base = this.currencyService.get(trip.baseCurrency);
    const rate = currency === trip.baseCurrency ? 1 : exchangeRate;
    const amountMinor = this.toMinor(amount, currency);
    const baseAmountMinor = this.toBaseMinor(amountMinor, currency, base, rate);

    const saved = await this.paymentRepository.save(
      this.paymentRepository.create({ 
        tripId, 
        fromUserId: userId, 
        toUserId, 
        paidAt: new Date(paidAt),
        currency,
        exchangeRate: rate,
        amountMinor,
        baseAmountMinor
       }),
    );

    return this.toPaymentDto(await this.loadPayment(saved.id), base);
  }

  async findPayments(tripId: number, userId: number, query: CursorPaginationQueryDto): Promise<PaginatedResponseDto<PaymentResponseDto>> {
    const trip = await this.tripService.ensureTripAccess(tripId, userId);
    const base = this.currencyService.get(trip.baseCurrency);

     const { cursor, limit = 10 } = query;

    const payments = await this.paymentRepository.find({
      where: { tripId, ...(cursor ? { id: LessThan(cursor)} : {})},
      relations: { fromUser: true, toUser: true },
      order: { id: 'DESC' },
      take: limit + 1,
    });

    const hasNextPage = payments.length > limit;
    if (hasNextPage) payments.pop();

    let nextCursor: number | null = null;
    if (hasNextPage && payments.length > 0) nextCursor = payments[payments.length - 1].id;

    const data = payments.map((p) => this.toPaymentDto(p, base));
    return new PaginatedResponseDto(data, nextCursor, hasNextPage);
  }

  async updatePayment(tripId: number, userId: number, id: number, updatePaymentDto: UpdatePaymentDto): Promise<PaymentResponseDto> {
    const trip = await this.tripService.ensureTripAccess(tripId, userId);
    const payment = await this.paymentRepository.findOneBy({ id, tripId });
    if (!payment || (payment.fromUserId !== userId && payment.toUserId !== userId)) {
      throw new NotFoundException('Payment not found');
    }

    const base = this.currencyService.get(trip.baseCurrency);
    const { toUserId, amount, currency, paidAt, exchangeRate } = updatePaymentDto;

    if (toUserId !== undefined && toUserId !== payment.toUserId) {
      this.tripService.assertMembers(trip, [toUserId]);
      payment.toUserId = toUserId;
    }
    if (payment.fromUserId === payment.toUserId) throw new BadRequestException('Cannot pay yourself');
    if (paidAt) payment.paidAt = new Date(paidAt);

    const newCurrency = currency ?? payment.currency;
    const currencyChanged = newCurrency !== payment.currency;

    if (currencyChanged && amount === undefined) {
      throw new BadRequestException('Amount is required when changing currency');
    }
    if (currencyChanged && newCurrency !== trip.baseCurrency && exchangeRate === undefined) {
      throw new BadRequestException('Exchange rate is required when changing currency');
    }

    const newRate = newCurrency === trip.baseCurrency ? 1 : (exchangeRate ?? payment.exchangeRate);

    if (amount !== undefined || currencyChanged || newRate !== payment.exchangeRate) {
      if (amount !== undefined) payment.amountMinor = this.toMinor(amount, newCurrency);
      payment.baseAmountMinor = this.toBaseMinor(payment.amountMinor, newCurrency, base, newRate);
      payment.exchangeRate = newRate;
    }
    payment.currency = newCurrency;

    await this.paymentRepository.save(payment);
    return this.toPaymentDto(await this.loadPayment(id), base);
  }

  async removePayment(tripId: number, userId: number, id: number) {
    await this.tripService.ensureTripAccess(tripId, userId);
    const payment = await this.paymentRepository.findOneBy({ id, tripId });
    if (!payment || (payment.fromUserId !== userId && payment.toUserId !== userId)) throw new NotFoundException('Payment not found');
    await this.paymentRepository.delete(id);
  }

  async getSettlements(tripId: number, userId: number): Promise<SettlementResponseDto> {
    const trip = await this.tripService.ensureTripAccess(tripId, userId);
    const base = this.currencyService.get(trip.baseCurrency);

    const [paid, shares, given, received] = await Promise.all([
      // koliko je ko platio
      this.expenseRepository
        .createQueryBuilder('e')
        .select('e.paidById', 'userId')
        .addSelect('SUM(e.baseAmountMinor)', 'total')
        .where('e.tripId = :tripId', { tripId })
        .groupBy('e.paidById')
        .getRawMany<SumRow>(),
      // koliki je ukupan udeo
      this.expenseRepository
        .createQueryBuilder('e')
        .innerJoin('e.participants', 'p')
        .select('p.userId', 'userId')
        .addSelect('SUM(p.amount)', 'total')
        .where('e.tripId = :tripId', { tripId })
        .groupBy('p.userId')
        .getRawMany<SumRow>(),
      // uplate ucesnika
      this.paymentRepository
        .createQueryBuilder('pay')
        .select('pay.fromUserId', 'userId')
        .addSelect('SUM(pay.baseAmountMinor)', 'total')
        .where('pay.tripId = :tripId', { tripId })
        .groupBy('pay.fromUserId')
        .getRawMany<SumRow>(),
      // primljene uplate
      this.paymentRepository
        .createQueryBuilder('pay')
        .select('pay.toUserId', 'userId')
        .addSelect('SUM(pay.baseAmountMinor)', 'total')
        .where('pay.tripId = :tripId', { tripId })
        .groupBy('pay.toUserId')
        .getRawMany<SumRow>(),
    ]);

    const balances = new Map<number, number>();
    const apply = (rows: SumRow[], sign: 1 | -1) => {
      for (const row of rows) {
        const id = Number(row.userId);
        balances.set(id, (balances.get(id) ?? 0) + sign * Number(row.total ?? 0));
      }
    };
    apply(paid, 1);
    apply(shares, -1);
    apply(given, 1);
    apply(received, -1);

    for (const member of trip.members) {
      if (!balances.has(member.id)) balances.set(member.id, 0);
    }

    let sum = 0;
    for (const value of balances.values()) sum += value;
    if (sum !== 0) throw new InternalServerErrorException('Balances are inconsistent');

    const users = new Map<number, User>(trip.members.map((m) => [m.id, m]));
    const missingIds = [...balances.keys()].filter((id) => !users.has(id));
    if (missingIds.length > 0) {
      const extra = await this.expenseRepository.manager.findBy(User, { id: In(missingIds) });
      extra.forEach((u) => users.set(u.id, u));
    }

    const balanceDtos = [...balances.entries()]
      .sort(([idA, a], [idB, b]) => b - a || idA - idB)
      .map(([id, balance]) => new BalanceDto(users.get(id)!, balance, base));

    const transactionDtos = computeSettlements(balances).map(
      (t) => new SettlementTransactionDto(users.get(t.fromUserId)!, users.get(t.toUserId)!, t.amountMinor, base),
    );

    return new SettlementResponseDto(base, balanceDtos, transactionDtos);
  }

  async getSpendingByCategory(tripId: number, userId: number): Promise<SpendingByCategoryResponseDto> {
    const trip = await this.tripService.ensureTripAccess(tripId, userId);
    const base = this.currencyService.get(trip.baseCurrency);

    const expenses = await this.expenseRepository.find({
      where: { tripId },
      select: { id: true, category: true, baseAmountMinor: true },
    });

    const grouped = new Map<ExpenseCategory, { total: number; count: number }>();
    for (const e of expenses) {
      const entry = grouped.get(e.category) ?? { total: 0, count: 0 };
      entry.total += e.baseAmountMinor ?? 0;
      entry.count += 1;
      grouped.set(e.category, entry);
    }

    const totalSpentMinor = expenses.reduce((acc, e) => acc + (e.baseAmountMinor ?? 0), 0);

    const categories = [...grouped.entries()]
      .sort(([, a], [, b]) => b.total - a.total)
      .map(([category, { total, count }]) =>
        new CategorySpendingDto(category, total, count, totalSpentMinor, base.minorUnits),
      );

    return new SpendingByCategoryResponseDto(trip.baseCurrency, base.minorUnits, expenses.length, totalSpentMinor, categories);
  }
}
