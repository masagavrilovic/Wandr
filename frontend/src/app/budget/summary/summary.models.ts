import { UserSummary } from "../../user/user.models";
import { ExpenseCategory } from "../expenses/expenses.models";

export interface Balance {
    user: UserSummary;
    balanceMinor: number;
    balance: number;
}

export interface SettlementTransaction {
    from: UserSummary;
    to: UserSummary;
    amountMinor: number;
    amount: number;
}

export interface Settlement {
    baseCurrency: string;
    balances: Balance[];
    transactions: SettlementTransaction[];
}

export interface CategorySpending {
  category: ExpenseCategory;
  totalMinor: number;
  total: number;
  count: number;
  percentage: number;
}

export interface SpendingByCategory {
  currency: string;
  totalExpenses: number;
  totalSpentMinor: number;
  totalSpent: number;
  categories: CategorySpending[];
}