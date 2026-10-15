import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsDateString, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Matches } from "class-validator";


export class UpdateExpenseDto {
    @IsOptional()
    @IsDateString()
    paidAt?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    description?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber({ allowNaN: false, allowInfinity: false})
    @IsPositive()
    amount?: number;

    @IsOptional()
    @Matches(/^[A-Z]{3}$/, { message: 'currency must be a 3-letter uppercase ISO 4217 code' })
    currency?: string;

    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @Type(() => Number)
    @IsInt({ each: true })
    participantIds?: number[];
}
