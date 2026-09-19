import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthActions } from './store/auth.actions';
import { AuthService } from './auth.service';

const AUTH_PATHS = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('http://localhost:3000')) return next(req);

  const authService = inject(AuthService);
  const store = inject(Store);

  const authReq = req.clone({ withCredentials: true });

  return next(authReq).pipe(
    catchError((error: unknown) => {
      const is401 = error instanceof HttpErrorResponse && error.status === 401;
      const isAuthCall = AUTH_PATHS.some((p) => req.url.includes(p));

      if (!is401 || isAuthCall) return throwError(() => error);

      return authService.refresh().pipe(
        catchError((refreshErr: unknown) => {
          const rejected =
            refreshErr instanceof HttpErrorResponse &&
            (refreshErr.status === 401 || refreshErr.status === 403);
          if (rejected) store.dispatch(AuthActions.sessionExpired());
          return throwError(() => refreshErr);
        }),
        switchMap(() => next(authReq)),
      );
    }),
  );
};