import { IsString, IsNotEmpty, IsDateString, IsOptional, IsUrl } from 'class-validator';

export class UpdateTripDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name?: string;

    @IsOptional()
    @IsDateString()
    startDate?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;

    @IsOptional()
    @IsUrl()
    imageUrl?: string;
}