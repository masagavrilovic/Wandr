import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { TripsService } from "../trips.service";
import { LoadTripsActions } from "./trips.actions";
import { catchError, map, of, switchMap } from "rxjs";
import { Trip } from "../trips.models";

@Injectable()
export class TripsEffect {
    private readonly actions$ = inject(Actions);
    private readonly tripsService = inject(TripsService);

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
}