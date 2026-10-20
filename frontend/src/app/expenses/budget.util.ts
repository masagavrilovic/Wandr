import { UserSummary } from "../user/user.models";
import { Expense, Payment } from "./expenses.models";

export interface Settlement {
    from: UserSummary;
    to: UserSummary;
    amountMinor: number;
    amount: number;
}

interface Balance {
    user: UserSummary;
    amount: number;
}

export function calculateSettlements(expenses: Expense[], payments: Payment[], minorUnits: number): Settlement[] {
    const users = new Map<number, UserSummary>();
    const balances = new Map<number, number>();

    const add = (user: UserSummary, amount: number) => {
        users.set(user.id, user);
        balances.set(user.id, (balances.get(user.id) ?? 0) + amount);
    };

    for (const e of expenses) {
        add(e.paidBy, e.baseAmountMinor);
        for (const p of e.participants) add(p.user, -p.amountMinor);
    }

    for (const p of payments) {
        add(p.from, p.amountMinor);
        add(p.to, -p.amountMinor);
    }

    const creditors: Balance[] = [];
    const debtors: Balance[] = [];
    for (const [id, balance] of balances) {
        const user = users.get(id)!;
        if (balance > 0) creditors.push({ user, amount: balance });
        else if (balance < 0) debtors.push({ user, amount: -balance });
    }

    const result: Settlement[] = [];
    const byAmountDesc = (a: Balance, b: Balance) => b.amount - a.amount;

    while (debtors.length && creditors.length) {
        debtors.sort(byAmountDesc);
        creditors.sort(byAmountDesc);

        const debtor = debtors[0];
        const creditor = creditors[0];
        const amountMinor = Math.min(debtor.amount, creditor.amount);

        result.push({
            from: debtor.user,
            to: creditor.user,
            amountMinor,
            amount: amountMinor / 10 ** minorUnits,
        });

        debtor.amount -= amountMinor;
        creditor.amount -= amountMinor;
        if (debtor.amount === 0) debtors.shift();
        if (creditor.amount === 0) creditors.shift();
    }

    return result;
}