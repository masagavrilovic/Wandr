import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CreateUpdateNotePayload, Note } from "./notes.models";

@Injectable({ providedIn: 'root'})
export class NotesService {
    private http = inject(HttpClient);
    private baseUrl = 'http://localhost:3000/notes';

    getAll(tripId: number): Observable<Note[]> {
        return this.http.get<Note[]>(`${this.baseUrl}/${tripId}`);
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