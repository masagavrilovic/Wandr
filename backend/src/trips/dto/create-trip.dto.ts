import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateTripDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsDateString()
    startDate: string;

    @IsDateString()
    endDate: string;

    @IsOptional()
    @IsUrl()
    imageUrl?: string
}
