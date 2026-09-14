import { IsEnum, IsNotEmpty } from 'class-validator';
import { TripStatus } from '../entities/trip.entity';

export class UpdateTripStatusDto {
    @IsNotEmpty()
    @IsEnum(TripStatus)
    status: TripStatus;
}