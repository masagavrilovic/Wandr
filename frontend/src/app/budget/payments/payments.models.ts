import { UserSummary } from "../../user/user.models";

export interface Payment {
    id: number;
    tripId: number;
    from: UserSummary;
    to: UserSummary;
    paidAt: string;
    amount: number;
    currency: string;
    baseAmount: number;
    baseAmountMinor: number;
    baseCurrency: string;
    exchangeRate: number;
    createdAt: string;
}

export interface CreatePaymentPayload {
    toUserId: number;
    paidAt: string;
    amount: number;
    currency: string;
    exchangeRate: number;
}

export interface UpdatePaymentPayload {
    toUserId?: number;
    paidAt?: string;
    amount?: number;
    currency?: string;
    exchangeRate?: number;
}