import { IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTripDto {
    @IsString()
    @IsNotEmpty()
    destination: string;

    @IsDateString()
    startDate: string;

    @IsDateString()
    endDate: string;

    @IsOptional()
    @IsString()
    imageUrl?: string;
}
