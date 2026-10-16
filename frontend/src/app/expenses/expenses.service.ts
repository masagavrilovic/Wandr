import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CreateExpensePayload, Expense, UpdateExpensePayload } from "./expenses.models";

@Injectable({ providedIn: 'root'})
export class ExpensesService {
    private http = inject(HttpClient);
    private baseUrl = 'http://localhost:3000/expense';

    getAll(tripId: number): Observable<Expense[]> {
        return this.http.get<Expense[]>(`${this.baseUrl}/${tripId}`);
    }

    getOne(tripId: number, id: number): Observable<Expense> {
        return this.http.get<Expense>(`${this.baseUrl}/${tripId}/${id}`);
    }

    create(tripId: number, payload: CreateExpensePayload): Observable<Expense> {
        return this.http.post<Expense>(`${this.baseUrl}/${tripId}`, payload);
    }

    update(tripId: number, id: number, payload: UpdateExpensePayload): Observable<Expense> {
        return this.http.patch<Expense>(`${this.baseUrl}/${tripId}/${id}`, payload);
    }

    delete(tripId: number, id: number) {
        return this.http.delete(`${this.baseUrl}/${tripId}/${id}`);
    }

}