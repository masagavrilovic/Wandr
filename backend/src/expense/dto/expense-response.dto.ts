import { Expense, ExpenseCategory } from '../entities/expense.entity';

export class ExpenseResponseDto {
    id: number;
    tripId: number;
    paidById: number;
    paidAt: string;
    amount: number;
    amountMinor: number;
    currency: string;
    description: string;
    category: ExpenseCategory;
    participantIds: number[];

    constructor(expense: Expense, minorUnits: number) {
        this.id = expense.id;
        this.tripId = expense.tripId;
        this.paidById = expense.paidById;
        this.paidAt = expense.paidAt.toISOString().slice(0, 10);
        this.amount = expense.amountMinor / Math.pow(10, minorUnits);
        this.amountMinor = expense.amountMinor;
        this.currency = expense.currency;
        this.description = expense.description;
        this.category = expense.category;
        this.participantIds = (expense.participants ?? []).map((u) => u.id);
    }
}