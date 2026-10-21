import { UserSummary } from "../../user/user.models";

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