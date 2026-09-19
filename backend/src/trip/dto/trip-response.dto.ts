import { Trip, TripStatus } from "../entities/trip.entity";

export class TripResponseDto {
    id: number;
    destination: string;
    startDate: string;
    endDate: string;
    imageUrl?: string;
    status: TripStatus
    inviteCode: string;

    constructor(trip: Trip) {
        this.id = trip.id;
        this.destination = trip.destination;
        this.startDate = trip.startDate.toISOString().slice(0, 10);
        this.endDate = trip.endDate.toISOString().slice(0, 10);
        this.imageUrl = trip.imageUrl;
        this.status = trip.status;
        this.inviteCode = trip.inviteCode;
    }
}