import { Activity } from "../entities/activity.entity";

export class ActivityResponseDto {
    id: number;
    name: string;
    date?: string;
    time?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    notes?: string;
    tripId: number;

    constructor(activity: Activity) {
        this.id = activity.id;
        this.name = activity.name;
        this.date = activity.date;
        this.time = activity.time;
        this.address = activity.address;
        this.latitude = activity.latitude != null ? Number(activity.latitude) : undefined;
        this.longitude = activity.longitude != null ? Number(activity.longitude) : undefined;
        this.notes = activity.notes;
        this.tripId = activity.tripId;
    }
}