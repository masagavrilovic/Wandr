import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { TripsService } from "../trips.service";
import { CreateTripActions, DeleteTripActions, JoinTripActions, LoadTripByIdActions, LoadTripsActions } from "./trips.actions";
import { catchError, exhaustMap, map, mergeMap, of, switchMap, tap } from "rxjs";
import { Trip } from "../trips.models";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable()
export class TripsEffect {
    private readonly actions$ = inject(Actions);
    private readonly tripsService = inject(TripsService);
    private readonly router = inject(Router);

    loadTrips = createEffect(() => 
        this.actions$.pipe(
            ofType(LoadTripsActions.loadTrips),
            switchMap(() => 
                this.tripsService.getAll().pipe(
                    map((trips: Trip[]) => LoadTripsActions.loadTripsSuccess({ trips })),
                    catchError((error: HttpErrorResponse) => of(LoadTripsActions.loadTripsFailure({ error: error.message })))
                )
            )

        )
    );

    createTrip = createEffect(() =>
        this.actions$.pipe(
            ofType(CreateTripActions.createTrip),
            exhaustMap(({ payload, image }) =>
                this.tripsService.create(payload, image).pipe(
                    map((trip) => CreateTripActions.createTripSuccess({ trip })),
                    catchError((error: HttpErrorResponse) => of(CreateTripActions.createTripFailure({ error: error.message })))
                )
            )
        )
    );

    navigateAfterCreate = createEffect(() =>
        this.actions$.pipe(
            ofType(CreateTripActions.createTripSuccess),
            tap(() => this.router.navigate(['/dashboard']))
        ),
        { dispatch: false }
    );

    joinTrip = createEffect(() =>
        this.actions$.pipe(
            ofType(JoinTripActions.joinTrip),
            mergeMap(({ inviteCode }) =>
                this.tripsService.join(inviteCode).pipe(
                    map((trip) => JoinTripActions.joinTripSuccess({ trip })),
                    catchError((error: HttpErrorResponse) => of(JoinTripActions.joinTripFailure({ error: error.message })))
                )
            )
        )
    );

    loadTripById = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadTripByIdActions.loadTripById),
            switchMap(({ id }) =>
                this.tripsService.getOne(id).pipe(
                    map((trip) => LoadTripByIdActions.loadTripByIdSuccess({ trip })),
                    catchError((error: HttpErrorResponse) => of(LoadTripByIdActions.loadTripByIdFailure({ error: error.message })))
                )
            )
        )
    );

    deleteTrip = createEffect(() => 
        this.actions$.pipe(
            ofType(DeleteTripActions.deleteTrip),
            exhaustMap(({id}) =>
                this.tripsService.delete(id).pipe(
                    map(() => DeleteTripActions.deleteTripSuccess({ id })),
                    catchError((error: HttpErrorResponse) => of(DeleteTripActions.deleteTripFailure({ error: error.message })))
                )
            )
        )
    );
}