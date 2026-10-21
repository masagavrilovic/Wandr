import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Settlement } from "./summary/summary.models";
import { CreateExpensePayload, Expense, UpdateExpensePayload } from "./expenses/expenses.models";
import { CreatePaymentPayload, Payment, UpdatePaymentPayload } from "./payments/payments.models";

@Injectable({ providedIn: 'root'})
export class BudgetService {
    private http = inject(HttpClient);
    private baseUrl = 'http://localhost:3000/expense';

    getSettlements(tripId: number): Observable<Settlement> {
        return this.http.get<Settlement>(`${this.baseUrl}/${tripId}/settlements`);
    }

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

    getPayments(tripId: number): Observable<Payment[]> {
        return this.http.get<Payment[]>(`${this.baseUrl}/${tripId}/payments`);
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