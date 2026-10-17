import { Currency } from '../../currency/currency.service';
import { UserSummaryDto } from '../../user/dto/user-response.dto';
import { Expense, ExpenseCategory } from '../entities/expense.entity';

export class ExpenseResponseDto {
    id: number;
    tripId: number;
    paidBy: UserSummaryDto;
    paidAt: string;
    amount: number;
    currency: string;
    baseAmount: number;
    baseAmountMinor: number;
    baseCurrency: string;
    exchangeRate: number;
    description: string;
    category: ExpenseCategory;
    participantIds: number[];

    constructor(expense: Expense, minorUnits: number, baseCurrency: Currency) {
        this.id = expense.id;
        this.tripId = expense.tripId;
        this.paidBy = new UserSummaryDto(expense.paidBy);
        this.paidAt = expense.paidAt.toISOString().slice(0, 10);
        this.amount = expense.amountMinor / Math.pow(10, minorUnits);
        this.currency = expense.currency;
        this.baseAmount = expense.baseAmountMinor / Math.pow(10, baseCurrency.minorUnits);
        this.baseAmountMinor = expense.baseAmountMinor;
        this.baseCurrency = baseCurrency.code;
        this.exchangeRate = expense.exchangeRate;
        this.description = expense.description;
        this.category = expense.category;
        this.participantIds = (expense.participants ?? []).map((u) => u.id);
    }
}