import { Currency } from "../../../currency/currency.service";
import { UserSummaryDto } from "../../../user/dto/user-response.dto";
import { Payment } from "../../entities/payment.entity";

export class PaymentResponseDto {
  id: number;
  tripId: number;
  from: UserSummaryDto;
  to: UserSummaryDto;
  paidAt: string;
  amount: number;
  currency: string;
  baseAmount: number;
  baseAmountMinor: number;
  baseCurrency: string;
  exchangeRate: number;

  constructor(payment: Payment, minorUnits: number, baseCurrency: Currency) {
    this.id = payment.id;
    this.tripId = payment.tripId;
    this.from = new UserSummaryDto(payment.fromUser);
    this.to = new UserSummaryDto(payment.toUser);
    this.paidAt = payment.paidAt.toISOString().slice(0, 10);
    this.amount = payment.amountMinor / Math.pow(10, minorUnits);
    this.currency = payment.currency;
    this.baseAmount = payment.baseAmountMinor / Math.pow(10, baseCurrency.minorUnits);
    this.baseAmountMinor = payment.baseAmountMinor;
    this.baseCurrency = baseCurrency.code;
    this.exchangeRate = payment.exchangeRate;
  }
}