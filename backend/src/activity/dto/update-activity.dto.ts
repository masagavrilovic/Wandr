import { IsString, IsNotEmpty, IsOptional, IsDateString, IsEnum, IsLatitude, IsLongitude } from "class-validator";
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
    @IsLatitude()
    latitude?: number;

    @IsOptional()
    @IsLongitude()
    longitude?: number;

    @IsOptional()
    @IsEnum(ActivityCategory)
    category?: ActivityCategory;

    @IsOptional()
    @IsString()
    notes?: string;
}