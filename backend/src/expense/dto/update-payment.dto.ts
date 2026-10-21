import { Type } from "class-transformer";
import { IsDateString, IsInt, IsNumber, IsOptional, IsPositive, Matches } from "class-validator";


export class UpdatePaymentDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    toUserId: number;

    @IsOptional()
    @IsDateString()
    paidAt?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber({ allowNaN: false, allowInfinity: false})
    @IsPositive()
    amount?: number;

    @IsOptional()
    @Matches(/^[A-Z]{3}$/, { message: 'currency must be a 3-letter uppercase ISO 4217 code' })
    currency?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber({ allowNaN: false, allowInfinity: false })
    @IsPositive()
    exchangeRate?: number;
}
