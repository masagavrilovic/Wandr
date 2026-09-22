import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Activity, CreateActivityPayload, UpdateActivityPayload } from "./activities.models";

@Injectable({ providedIn: 'root'})
export class ActivityService {
    private http = inject(HttpClient);
    private baseUrl = 'http://localhost:3000/activities';

    getAll(tripId: number): Observable<Activity[]> {
        return this.http.get<Activity[]>(`${this.baseUrl}/trip/${tripId}`);
    }

    create(tripId: number, payload: CreateActivityPayload): Observable<Activity> {
        return this.http.post<Activity>(`${this.baseUrl}/${tripId}`, payload);
    }

    update(tripId: number, id: number, payload: UpdateActivityPayload): Observable<Activity> {
        return this.http.patch<Activity>(`${this.baseUrl}/${tripId}/${id}`, payload);
    }

    delete(tripId: number, id: number) {
        return this.http.delete(`${this.baseUrl}/${tripId}/${id}`);
    }
}