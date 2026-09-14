export enum TripStatus {
    PLANNING = 'Planning',
    ONGOING = 'Ongoing',
    FINISHED = 'Finished',
    CANCELED = 'Canceled',
}

export interface Trip {
    id: number;
    name: string;
    startDate: Date;
    endDate: Date;
    imageUrl?: string;
    status: TripStatus;
}