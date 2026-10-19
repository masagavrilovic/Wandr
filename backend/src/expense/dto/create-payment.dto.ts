import { Type } from "class-transformer";
import { IsInt, IsNumber, IsPositive } from "class-validator";

export class CreatePaymentDto {
  @Type(() => Number)
  @IsInt()
  toUserId: number;

  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @IsPositive()
  amount: number;
}