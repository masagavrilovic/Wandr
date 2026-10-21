import { Currency } from '../../currency/currency.service';
import { UserSummaryDto } from '../../user/dto/user-response.dto';
import { User } from '../../user/entities/user.entity';

export class BalanceDto {
  user: UserSummaryDto;
  balanceMinor: number;
  balance: number;

  constructor(user: User, balanceMinor: number, base: Currency) {
    this.user = new UserSummaryDto(user);
    this.balanceMinor = balanceMinor;
    this.balance = balanceMinor / Math.pow(10, base.minorUnits);
  }
}

export class SettlementTransactionDto {
  from: UserSummaryDto;
  to: UserSummaryDto;
  amountMinor: number;
  amount: number;

  constructor(from: User, to: User, amountMinor: number, base: Currency) {
    this.from = new UserSummaryDto(from);
    this.to = new UserSummaryDto(to);
    this.amountMinor = amountMinor;
    this.amount = amountMinor / Math.pow(10, base.minorUnits);
  }
}

export class SettlementResponseDto {
  baseCurrency: string;
  balances: BalanceDto[];
  transactions: SettlementTransactionDto[];

  constructor(base: Currency, balances: BalanceDto[], transactions: SettlementTransactionDto[]) {
    this.baseCurrency = base.code;
    this.balances = balances;
    this.transactions = transactions;
  }
}