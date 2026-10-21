import { Type } from "class-transformer";
import { IsDateString, IsInt, IsNumber, IsPositive, Matches } from "class-validator";

export class CreatePaymentDto {
  @Type(() => Number)
  @IsInt()
  toUserId: number;

  @IsDateString()
  paidAt: string;

  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @IsPositive()
  amount: number;

  @Matches(/^[A-Z]{3}$/, { message: 'currency must be a 3-letter uppercase ISO 4217 code' })
  currency: string;

  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @IsPositive()
  exchangeRate: number;
}