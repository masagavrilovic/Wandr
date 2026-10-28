import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CreateUpdateNotePayload, Note } from "./notes.models";
import { PaginatedResponse } from "../shared/pagination.models";

@Injectable({ providedIn: 'root'})
export class NotesService {
    private http = inject(HttpClient);
    private baseUrl = 'http://localhost:3000/notes';

    getAll(tripId: number, limit?: number, cursor?: number | null, updatedAt?: string | null): Observable<PaginatedResponse<Note>> {
        let params = new HttpParams();
        if (limit) params = params.set('limit', limit);
        if (cursor) params = params.set('cursor', cursor);
        if (updatedAt) params = params.set('updatedAt', updatedAt);
        return this.http.get<PaginatedResponse<Note>>(`${this.baseUrl}/${tripId}`, { params });
    }

    getOne(tripId: number, id: number): Observable<Note> {
        return this.http.get<Note>(`${this.baseUrl}/${tripId}/${id}`);
    }

    create(tripId: number, payload: CreateUpdateNotePayload): Observable<Note> {
        return this.http.post<Note>(`${this.baseUrl}/${tripId}`, payload);
    }

    update(tripId: number, id: number, payload: CreateUpdateNotePayload): Observable<Note> {
        return this.http.patch<Note>(`${this.baseUrl}/${tripId}/${id}`, payload);
    }

    delete(tripId: number, id: number) {
        return this.http.delete(`${this.baseUrl}/${tripId}/${id}`);
    }

}