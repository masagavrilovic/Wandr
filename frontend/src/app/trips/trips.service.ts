import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Trip } from "./trips.models";

@Injectable({ providedIn: 'root'})
export class TripsService {
    private http = inject(HttpClient);
    private baseUrl = 'http://localhost:3000/trips';

    getAll(): Observable<Trip[]> {
        return this.http.get<Trip[]>(this.baseUrl);
    }
}