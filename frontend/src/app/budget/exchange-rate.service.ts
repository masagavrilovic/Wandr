import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, retry, throwError, timeout, timer } from 'rxjs';

interface RateResponse {
    rate: number;
}

export function todayLocal(): string {
    const d = new Date();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
}

@Injectable({ providedIn: 'root' })
export class ExchangeRateService {
    private http = inject(HttpClient);
    private baseUrl = 'https://api.frankfurter.dev/v2/rate';

    getRate(from: string, to: string, date?: string): Observable<number> {
        let params = new HttpParams();
        if (date && date <= todayLocal()) {
            params = params.set('date', date);
        }
 
        return this.http
            .get<RateResponse>(`${this.baseUrl}/${from}/${to}`, { params })
            .pipe(
                timeout(4000),
                retry({
                    count: 2,
                    delay: (err) =>
                        err instanceof HttpErrorResponse && err.status >= 400 && err.status < 500
                            ? throwError(() => err)
                            : timer(500),
                }),
                map((res) => {
                    if (typeof res?.rate !== 'number' || !(res.rate > 0)) {
                        throw new Error('Invalid exchange rate response');
                    }
                    return res.rate;
                }),
            );
    }
}