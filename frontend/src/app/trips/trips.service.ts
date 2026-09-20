import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Trip } from "./trips.models";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root'})
export class TripsService {
    private http = inject(HttpClient);
    private baseUrl = 'http://localhost:3000/trip';

    getAll(): Observable<Trip[]> {
        return this.http.get<Trip[]>(this.baseUrl);
    }

}