import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Activity } from "./activities.models";

@Injectable({ providedIn: 'root'})
export class ActivityService {
    private http = inject(HttpClient);
    private baseUrl = 'http://localhost:3000/activities';

    getAll(tripId: number): Observable<Activity[]> {
        return this.http.get<Activity[]>(`${this.baseUrl}/${tripId}`);
    }
}