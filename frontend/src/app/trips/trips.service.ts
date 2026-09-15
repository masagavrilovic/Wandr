import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CreateTripPayload, Trip } from "./trips.models";

@Injectable({ providedIn: 'root'})
export class TripsService {
    private http = inject(HttpClient);
    private baseUrl = 'http://localhost:3000/trips';

    getAll(): Observable<Trip[]> {
        return this.http.get<Trip[]>(this.baseUrl);
    }

    createTrip(payload: CreateTripPayload): Observable<Trip> {
        return this.http.post<Trip>(this.baseUrl, payload);
    }

    uploadTripImage(tripId: number, file: File): Observable<Trip> {
        const formData = new FormData();
        formData.append('image', file);
        return this.http.post<Trip>(`${this.baseUrl}/${tripId}/image`, formData);
    }

    joinTrip(code: string) : Observable<Trip> {
        return this.http.post<Trip>(`${this.baseUrl}/join/${code}`, {});
    }
}