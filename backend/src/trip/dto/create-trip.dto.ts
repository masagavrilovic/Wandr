import { IsDateString, IsLatitude, IsLongitude, IsNotEmpty, IsString } from "class-validator";

export class CreateTripDto {
    @IsString()
    @IsNotEmpty()
    destination: string;

    @IsLatitude()
    latitude?: number;

    @IsLongitude()
    longitude?: number;

    @IsDateString()
    startDate: string;

    @IsDateString()
    endDate: string;
}
