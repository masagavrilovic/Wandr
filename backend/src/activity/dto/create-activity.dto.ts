import { IsString, IsNotEmpty, IsOptional, IsDateString, IsNumber, Min, Max, ValidateIf, IsEnum } from "class-validator";
import { ActivityCategory } from "../entities/activity.entity";

export class CreateActivityDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsDateString()
    date?: string;

    @IsOptional()
    time?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    address?: string;

    @ValidateIf(o => o.longitude != null || o.latitude != null)
    @IsNumber()
    @Min(-90)
    @Max(90)
    latitude?: number;

    @ValidateIf(o => o.longitude != null || o.latitude != null)
    @IsNumber()
    @Min(-180)
    @Max(180)
    longitude?: number;

    @IsOptional()
    @IsEnum(ActivityCategory)
    category?: ActivityCategory;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    notes?: string;
}