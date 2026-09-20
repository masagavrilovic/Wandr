import { IsString, IsNotEmpty, IsDateString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { TripStatus } from '../entities/trip.entity';
import { Transform } from 'class-transformer';

export class UpdateTripDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    destination?: string;

    @IsOptional()
    @IsDateString()
    startDate?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsEnum(TripStatus)
    status?: TripStatus;

    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    removeImage?: boolean;
}