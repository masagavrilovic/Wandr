export enum TripStatus {
    PLANNING = 'Planning',
    ONGOING = 'Ongoing',
    FINISHED = 'Finished',
    CANCELED = 'Canceled',
}

export interface Trip {
    id: number;
    destination: string;
    latitude: number;
    longitude: number;
    startDate: Date;
    endDate: Date;
    imagePath?: string;
    status: TripStatus;
    inviteCode: string;

}

export interface CreateTripPayload {
    destination: string;
    latitude: number;
    longitude: number;
    startDate: string;
    endDate: string;
}

export interface UpdateTripPayload {
    destination?: string;
    latitude?: number;
    longitude?: number;
    startDate?: string;
    endDate?: string;
    status?: TripStatus;
    removeImage?: boolean;
}