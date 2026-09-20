import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { TripsService } from "../trips.service";
import { CreateTripActions, LoadTripsActions } from "./trips.actions";
import { catchError, exhaustMap, map, of, switchMap, tap } from "rxjs";
import { Trip } from "../trips.models";
import { Router } from "@angular/router";

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
                    catchError((error) => of(LoadTripsActions.loadTripsFailure({ error })))
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
                    catchError((error) => of(CreateTripActions.createTripFailure({ error })))
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
}