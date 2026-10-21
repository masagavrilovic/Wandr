export interface Transfer {
  fromUserId: number;
  toUserId: number;
  amountMinor: number;
}

interface Participant {
  userId: number;
  amount: number;
}

const byAmountDesc = (a: Participant, b: Participant) => b.amount - a.amount || a.userId - b.userId;

export function computeSettlements(balances: Map<number, number>): Transfer[] {
  const debtors: Participant[] = [];
  const creditors: Participant[] = [];

  for (const [userId, balance] of balances) {
    if (balance < 0) debtors.push({ userId, amount: -balance });
    else if (balance > 0) creditors.push({ userId, amount: balance });
  }

  const transfers: Transfer[] = [];

  while (debtors.length > 0 && creditors.length > 0) {
    debtors.sort(byAmountDesc);
    creditors.sort(byAmountDesc);

    const debtor = debtors[0];
    const creditor = creditors[0];
    const amount = Math.min(debtor.amount, creditor.amount);

    transfers.push({ fromUserId: debtor.userId, toUserId: creditor.userId, amountMinor: amount });

    debtor.amount -= amount;
    creditor.amount -= amount;

    if (debtor.amount === 0) debtors.shift();
    if (creditor.amount === 0) creditors.shift();
  }

  return transfers;
}