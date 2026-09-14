import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap } from "rxjs";
import { TripsService } from "../trips.service";
import { loadTrips, loadTripsFailure, loadTripsSuccess } from "./trips.actions";

@Injectable()
export class TripsEffects {
    private actions$ = inject(Actions);
    private tripsService = inject(TripsService);

    loadTrips$ = createEffect(() => 
        this.actions$.pipe(
            ofType(loadTrips),
            switchMap(() =>
            this.tripsService.getAll().pipe(
                map((trips) => loadTripsSuccess({ trips })),
                catchError((error) => of(loadTripsFailure({ error })))
            ))
        )
    );
}