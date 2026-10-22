import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Settlement, SpendingByCategory } from "./summary/summary.models";
import { CreateExpensePayload, Expense, UpdateExpensePayload } from "./expenses/expenses.models";
import { CreatePaymentPayload, Payment, UpdatePaymentPayload } from "./payments/payments.models";
import { PaginatedResponse } from "../shared/pagination.models";

@Injectable({ providedIn: 'root'})
export class BudgetService {
    private http = inject(HttpClient);
    private baseUrl = 'http://localhost:3000/budget';

    getSpendingByCategory(tripId: number): Observable<SpendingByCategory> {
        return this.http.get<SpendingByCategory>(`${this.baseUrl}/${tripId}/spending`);
    }

    getSettlements(tripId: number): Observable<Settlement> {
        return this.http.get<Settlement>(`${this.baseUrl}/${tripId}/settlements`);
    }

    getAll(tripId: number, limit: number = 10, cursor?: number | null): Observable<PaginatedResponse<Expense>> {
        let params = new HttpParams().set('limit', limit.toString());
        if (cursor) params = params.set('cursor', cursor.toString());
        return this.http.get<PaginatedResponse<Expense>>(`${this.baseUrl}/${tripId}`, { params });
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

    getPayments(tripId: number, limit: number = 10, cursor?: number | null): Observable<PaginatedResponse<Payment>> {
        let params = new HttpParams().set('limit', limit.toString());
        if (cursor) params = params.set('cursor', cursor.toString());
        return this.http.get<PaginatedResponse<Payment>>(`${this.baseUrl}/${tripId}/payments`, { params });
    }

    createPayment(tripId: number, payload: CreatePaymentPayload): Observable<Payment> {
        return this.http.post<Payment>(`${this.baseUrl}/${tripId}/payments`, payload);
    }

    updatePayment(tripId: number, id: number, payload: UpdatePaymentPayload): Observable<Payment> {
        return this.http.patch<Payment>(`${this.baseUrl}/${tripId}/payments/${id}`, payload);
    }

    deletePayment(tripId: number, id: number) {
         return this.http.delete(`${this.baseUrl}/${tripId}/payments/${id}`);
    }

}