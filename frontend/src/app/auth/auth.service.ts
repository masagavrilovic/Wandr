import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginCredentials, RegisterCredentials } from './auth.models'

@Injectable({ providedIn: 'root'})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/auth';

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        localStorage.setItem('access_token', response.access_token);
      }),
    );
  }
  
  register(credentials: RegisterCredentials): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/register`, credentials);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
}