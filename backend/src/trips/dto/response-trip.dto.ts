import { Trip, TripStatus } from "../entities/trip.entity";

export class TripResponseDto {
    id: number;
    name: string;
    startDate: Date;
    endDate: Date;
    imageUrl?: string;
    status: TripStatus

    constructor(trip: Trip) {
        this.id = trip.id;
        this.name = trip.name;
        this.startDate = trip.startDate;
        this.endDate = trip.endDate;
        this.imageUrl = trip.imageUrl;
        this.status = trip.status;
    }
}