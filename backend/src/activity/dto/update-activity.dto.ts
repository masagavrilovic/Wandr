import { IsString, IsNotEmpty, IsOptional, IsDateString, IsNumber, Min, Max, IsEnum } from "class-validator";
import { ActivityCategory } from "../entities/activity.entity";

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
    @IsEnum(ActivityCategory)
    category?: ActivityCategory;

    @IsOptional()
    @IsString()
    notes?: string;
}