import { IsDateString, IsNotEmpty, IsString } from "class-validator";

export class CreateTripDto {
    @IsString()
    @IsNotEmpty()
    destination: string;

    @IsDateString()
    startDate: string;

    @IsDateString()
    endDate: string;
}
