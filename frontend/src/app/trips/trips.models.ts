import { UserSummary } from "../user/user.models";

export enum TripStatus {
    PLANNING = 'Planning',
    ONGOING = 'Ongoing',
    FINISHED = 'Finished',
    CANCELED = 'Canceled',
}

export interface Trip {
    id: number;
    destination: string;
    startDate: Date;
    endDate: Date;
    imagePath?: string;
    status: TripStatus;
    inviteCode: string;
    baseCurrency: string;
    members: UserSummary[];
}

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