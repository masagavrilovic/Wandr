import { ExpenseCategory } from '../../entities/expense.entity';

export class CategorySpendingDto {
  category: ExpenseCategory;
  totalMinor: number;
  total: number;
  count: number;
  percentage: number;

  constructor(category: ExpenseCategory, totalMinor: number, count: number, grandTotalMinor: number, minorUnits: number) {
    this.category = category;
    this.totalMinor = totalMinor;
    this.total = totalMinor / 10 ** minorUnits;
    this.count = count;
    this.percentage = grandTotalMinor > 0 ? Math.round((totalMinor / grandTotalMinor) * 1000) / 10 : 0;
  }
}

export class SpendingByCategoryResponseDto {
  currency: string;
  totalExpenses: number;
  totalSpentMinor: number;
  totalSpent: number;
  categories: CategorySpendingDto[];

  constructor(currency: string, minorUnits: number, totalExpenses: number, totalSpentMinor: number, categories: CategorySpendingDto[]) {
    this.currency = currency;
    this.totalExpenses = totalExpenses;
    this.totalSpentMinor = totalSpentMinor;
    this.totalSpent = totalSpentMinor / 10 ** minorUnits;
    this.categories = categories;
  }
}