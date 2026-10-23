import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { TripsService } from "../trips.service";
import { CreateTripActions, DeleteTripActions, JoinTripActions, LoadTripByIdActions, LoadTripsActions, UpdateTripActions } from "./trips.actions";
import { catchError, exhaustMap, filter, map, of, switchMap, tap } from "rxjs";
import { TripSummary } from "../trips.models";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { extractErrorMessage } from "../../shared/store/http-error";
import { selectSelectedTripId } from "./trips.selectors";

@Injectable()
export class TripsEffect {
    private readonly actions$ = inject(Actions);
    private readonly tripsService = inject(TripsService);
    private readonly router = inject(Router);
    private readonly store = inject(Store);

    loadTrips = createEffect(() => 
        this.actions$.pipe(
            ofType(LoadTripsActions.loadTrips),
            switchMap(() => 
                this.tripsService.getAll().pipe(
                    map((trips: TripSummary[]) => LoadTripsActions.loadTripsSuccess({ trips })),
                    catchError((error) => of(LoadTripsActions.loadTripsFailure({ error: extractErrorMessage(error) })))
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
                    catchError((error) => of(CreateTripActions.createTripFailure({ error: extractErrorMessage(error) })))
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
            exhaustMap(({ inviteCode }) =>
                this.tripsService.join(inviteCode).pipe(
                    map((trip) => JoinTripActions.joinTripSuccess({ trip })),
                    catchError((error) => of(JoinTripActions.joinTripFailure({ error: extractErrorMessage(error) })))
                )
            )
        )
    );

    loadSelectedTrip$ = createEffect(() =>
        this.store.select(selectSelectedTripId).pipe(
            filter((id) => id !== null),
            map((id) => LoadTripByIdActions.loadTripById({ id }))
        )
    );

    loadTripById = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadTripByIdActions.loadTripById),
            switchMap(({ id }) =>
                this.tripsService.getOne(id).pipe(
                    map((trip) => LoadTripByIdActions.loadTripByIdSuccess({ trip })),
                    catchError((error) => of(LoadTripByIdActions.loadTripByIdFailure({ error: extractErrorMessage(error) })))
                )
            )
        )
    );

    updateTrip = createEffect(() => 
        this.actions$.pipe(
            ofType(UpdateTripActions.updateTrip),
            exhaustMap(({ id, payload, image }) =>
                this.tripsService.update(id, payload, image).pipe(
                    map((trip) => UpdateTripActions.updateTripSuccess({ trip })),
                    catchError((error) => of(UpdateTripActions.updateTripFailure({ error: extractErrorMessage(error) })))
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
                    catchError((error) => of(DeleteTripActions.deleteTripFailure({ error: extractErrorMessage(error) })))
                )
            )
        )
    );

    navigateAfterDelete$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DeleteTripActions.deleteTripSuccess),
            tap(() => this.router.navigate(['/dashboard']))
        ),
        { dispatch: false }
    );
}