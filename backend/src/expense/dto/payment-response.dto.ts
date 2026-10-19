import { Currency } from "../../currency/currency.service";
import { UserSummaryDto } from "../../user/dto/user-response.dto";
import { Payment } from "../entities/payment.entity";

export class PaymentResponseDto {
  id: number;
  from: UserSummaryDto;
  to: UserSummaryDto;
  amount: number;
  amountMinor: number;
  baseCurrency: string;
  createdAt: string;

  constructor(payment: Payment, base: Currency) {
    this.id = payment.id;
    this.from = new UserSummaryDto(payment.fromUser);
    this.to = new UserSummaryDto(payment.toUser);
    this.amountMinor = payment.amountMinor;
    this.amount = payment.amountMinor / Math.pow(10, base.minorUnits);
    this.baseCurrency = base.code;
    this.createdAt = payment.createdAt.toISOString();
  }
}