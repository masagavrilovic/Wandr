export interface Expense {
    id: number;
    paidById: number;
    paidAt: string;
    amount: number;
    currency: string;
    description: string;
    participantIds: number[];
}

export interface CreateExpensePayload {
    description: string;
    paidAt: string;
    amount: number;
    currency: string;
    participantIds?: number[];
}

export interface UpdateExpensePayload {
    description?: string;
    paidAt?: string;
    amount?: number;
    currency?: string;
    participantIds?: number[];
}