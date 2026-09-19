import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, finalize, map, shareReplay } from 'rxjs';
import { LoginCredentials, RegisterData, User } from './auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private base = `http://localhost:3000/auth`;

  private refreshInFlight$: Observable<void> | null = null;

  register(data: RegisterData) {
    return this.http.post<User>(`${this.base}/register`, data);
  }

  login(credentials: LoginCredentials) {
    return this.http.post<{ message: string }>(`${this.base}/login`, credentials);
  }

  me() {
    return this.http.get<User>(`${this.base}/me`);
  }

  logout() {
    return this.http.post<void>(`${this.base}/logout`, {});
  }

  refresh(): Observable<void> {
    if (!this.refreshInFlight$) {
      this.refreshInFlight$ = this.http.post(`${this.base}/refresh`, {}).pipe(
        map(() => void 0),
        finalize(() => (this.refreshInFlight$ = null)),
        shareReplay({ bufferSize: 1, refCount: false }),
      );
    }
    return this.refreshInFlight$;
  }
}