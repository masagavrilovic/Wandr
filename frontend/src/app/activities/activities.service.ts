import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Activity, CreateActivityPayload, UpdateActivityPayload } from "./activities.models";
import { PaginatedResponse } from "../shared/pagination.models";

@Injectable({ providedIn: 'root'})
export class ActivityService {
    private http = inject(HttpClient);
    private baseUrl = 'http://localhost:3000/activities';

    getAll(tripId: number, limit?: number, cursor?: number | null, date?: string | null): Observable<PaginatedResponse<Activity>> {
        let params = new HttpParams();
        if (limit) params = params.set('limit', limit);
        if (cursor) params = params.set('cursor', cursor);
        if (date) params = params.set('date', date);
        return this.http.get<PaginatedResponse<Activity>>(`${this.baseUrl}/${tripId}`, { params });
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