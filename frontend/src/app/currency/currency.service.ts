import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Currency } from "./currency.models";
import { Observable } from "rxjs";


@Injectable({ providedIn: 'root' })
export class CurrencyService {
    private http = inject(HttpClient);
    private baseUrl = 'http://localhost:3000/currency';

    getAll(): Observable<Currency[]> {
        return this.http.get<Currency[]>(`${this.baseUrl}`);
    }
}
