import { UserSummaryDto } from "../../user/dto/user-response.dto";
import { Trip, TripStatus } from "../entities/trip.entity";

export class TripResponseDto {
    id: number;
    destination: string;
    startDate: string;
    endDate: string;
    imagePath?: string | null;
    status: TripStatus
    inviteCode: string;
    baseCurrency: string;
    members: UserSummaryDto[];

    constructor(trip: Trip) {
        this.id = trip.id;
        this.destination = trip.destination;
        this.startDate = trip.startDate.toISOString().slice(0, 10);
        this.endDate = trip.endDate.toISOString().slice(0, 10);
        this.imagePath = trip.imagePath;
        this.status = trip.status;
        this.inviteCode = trip.inviteCode;
        this.baseCurrency = trip.baseCurrency;
        this.members = trip.members.map((m) => new UserSummaryDto(m));
    }
}

export class TripSummaryDto {
    id: number;
    destination: string;
    startDate: string;
    endDate: string;
    status: TripStatus;
    imagePath?: string | null;

    constructor(trip: Trip) {
        this.id = trip.id;
        this.destination = trip.destination;
        this.startDate = trip.startDate.toISOString().slice(0, 10);
        this.endDate = trip.endDate.toISOString().slice(0, 10);
        this.status = trip.status;
        this.imagePath = trip.imagePath;
    }
}