import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CreatePackingListItemPayload, PackingListItem, UpdatePackingListItemPayload } from "./packing-list.models";

@Injectable({ providedIn: 'root'})
export class PackingListService {
    private http = inject(HttpClient);
    private baseUrl = 'http://localhost:3000/packing-list';

    getAll(tripId: number): Observable<PackingListItem[]> {
        return this.http.get<PackingListItem[]>(`${this.baseUrl}/${tripId}`);
    }

    getOne(tripId: number, id: number): Observable<PackingListItem> {
        return this.http.get<PackingListItem>(`${this.baseUrl}/${tripId}/${id}`);
    }

    create(tripId: number, payload: CreatePackingListItemPayload): Observable<PackingListItem> {
        return this.http.post<PackingListItem>(`${this.baseUrl}/${tripId}`, payload);
    }

    update(tripId: number, id: number, payload: UpdatePackingListItemPayload): Observable<PackingListItem> {
        return this.http.patch<PackingListItem>(`${this.baseUrl}/${tripId}/${id}`, payload);
    }

    delete(tripId: number, id: number) {
        return this.http.delete(`${this.baseUrl}/${tripId}/${id}`);
    }

}