import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AuthService } from "../auth.service";
import { AuthActions } from "./auth.actions";
import { catchError, exhaustMap, map, of, switchMap, tap } from "rxjs";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable()
export class AuthEffects {
    private actions$ = inject(Actions);
    private authService = inject(AuthService);
    private router = inject(Router);

    login$ = createEffect(() => 
        this.actions$.pipe(
            ofType(AuthActions.login),
            exhaustMap(({ credentials }) =>
                this.authService.login(credentials).pipe(
                    switchMap(() => this.authService.me()),
                    map((user) => AuthActions.loginSuccess({ user })),
                    catchError((error: HttpErrorResponse) => of(AuthActions.loginFailure({ error: error.message }))),
                )
            )
        )
    );

    register$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.register),
            exhaustMap(({ data }) => 
                this.authService.register(data).pipe(
                    map((user) => AuthActions.registerSuccess({ user })),
                    catchError((error: HttpErrorResponse) => of(AuthActions.registerFailure({ error: error.message }))),
                )
            )
        )
    );

    logout$ = createEffect(() => 
        this.actions$.pipe(
            ofType(AuthActions.logout),
            exhaustMap(() =>
                this.authService.logout().pipe(
                    map(() => AuthActions.logoutSuccess()),
                    catchError(() => of(AuthActions.logoutSuccess()))
                )
            )
        )
    );

    redirectAfterAuth$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.loginSuccess, AuthActions.registerSuccess),
            tap(() => this.router.navigate(['/']))
        ),
        { dispatch: false }
    );

    redirectToLogin$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.logoutSuccess, AuthActions.sessionExpired),
            tap(() => this.router.navigate(['/login']))
        ),
        { dispatch: false }
    );

    restoreSession$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.restoreSession),
                exhaustMap(() => 
                this.authService.refresh().pipe(
                    switchMap(() => this.authService.me()),
                    map((user) => AuthActions.sessionRestored({ user })),
                    catchError(() => of(AuthActions.sessionRestoreFailed()))
                )
            )
        )
    );
}