import { Trip } from "../entities/trip.entity";

export class TripResponseDto {
    id: number;
    name: string;
    startDate: Date;
    endDate: Date;
    imageUrl?: string;

    constructor(trip: Trip) {
        this.id = trip.id;
        this.name = trip.name;
        this.startDate = trip.startDate;
        this.endDate = trip.endDate;
        this.imageUrl = trip.imageUrl;
    }
}