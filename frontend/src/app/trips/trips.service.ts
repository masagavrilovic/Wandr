import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { CreateTripPayload, Trip } from "./trips.models";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root'})
export class TripsService {
    private http = inject(HttpClient);
    private baseUrl = 'http://localhost:3000/trip';

    getAll(): Observable<Trip[]> {
        return this.http.get<Trip[]>(this.baseUrl);
    }

    create(payload: CreateTripPayload, image?: File): Observable<Trip> {
        const formData = new FormData();
        formData.append('destination', payload.destination);
        formData.append('startDate', payload.startDate);
        formData.append('endDate', payload.endDate);
        if (image) formData.append('image', image);

        return this.http.post<Trip>(this.baseUrl, formData);
    }

    join(inviteCode: string): Observable<Trip> {
        return this.http.post<Trip>(`${this.baseUrl}/join/${inviteCode}`, {});
    }

    getOne(id: number): Observable<Trip> {
        return this.http.get<Trip>(`${this.baseUrl}/${id}`);
    }

    delete(id: number) {
        return this.http.delete(`${this.baseUrl}/${id}`);
    }

}