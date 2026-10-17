import { IsDateString, IsNotEmpty, IsString, Matches } from "class-validator";

export class CreateTripDto {
    @IsString()
    @IsNotEmpty()
    destination: string;

    @IsDateString()
    startDate: string;

    @IsDateString()
    endDate: string;

    @Matches(/^[A-Z]{3}$/, { message: 'baseCurrency must be a 3-letter uppercase ISO 4217 code' })
    baseCurrency: string;
}
