import { IsString, IsNotEmpty, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { TripStatus } from '../entities/trip.entity';

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
    @IsString()
    imageUrl?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsEnum(TripStatus)
    status?: TripStatus;
}