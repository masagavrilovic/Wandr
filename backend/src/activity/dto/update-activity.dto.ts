import { IsString, IsNotEmpty, IsOptional, IsDateString, IsNumber, Min, Max } from "class-validator";

export class UpdateActivityDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name?: string;

    @IsOptional()
    @IsDateString()
    date?: string;

    @IsOptional()
    time?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsNumber()
    @Min(-90)
    @Max(90)
    latitude?: number;

    @IsOptional()
    @IsNumber()
    @Min(-180)
    @Max(180)
    longitude?: number;

    @IsOptional()
    @IsString()
    notes?: string;
}