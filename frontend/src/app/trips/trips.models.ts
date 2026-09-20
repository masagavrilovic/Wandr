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
}