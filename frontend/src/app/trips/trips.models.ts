import { UserSummary } from "../user/user.models";

export enum TripStatus {
    PLANNING = 'Planning',
    ONGOING = 'Ongoing',
    FINISHED = 'Finished',
    CANCELED = 'Canceled',
}

export interface TripSummary {
    id: number;
    destination: string;
    startDate: Date;
    endDate: Date;
    imagePath?: string;
    status: TripStatus;
}

export interface Trip extends TripSummary {
    inviteCode: string;
    baseCurrency: string;
    members: UserSummary[];
}

export const toTripSummary = (trip: Trip): TripSummary => ({
    id: trip.id,
    destination: trip.destination,
    startDate: trip.startDate,
    endDate: trip.endDate,
    imagePath: trip.imagePath,
    status: trip.status,
});

export interface CreateTripPayload {
    destination: string;
    startDate: string;
    endDate: string;
    baseCurrency: string;
}

export interface UpdateTripPayload {
    destination?: string;
    startDate?: string;
    endDate?: string;
    status?: TripStatus;
    removeImage?: boolean;
}