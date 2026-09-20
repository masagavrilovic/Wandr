import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { ActivityService } from "../activities.service";
import { LoadActivitiesActions } from "./activites.actions";

@Injectable()
export class ActivityEffect {
    private readonly actions$ = inject(Actions);
    private readonly activityService = inject(ActivityService);

    loadActivities = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadActivitiesActions.loadActivities),
            switchMap(({ tripId }) => 
                this.activityService.getAll(tripId).pipe(
                    map((activities) => LoadActivitiesActions.loadActivitiesSuccess({ activities })),
                    catchError((error: HttpErrorResponse) => of(LoadActivitiesActions.loadActivitiesFailure({ error: error.message })))
                )
            )
        )
    );
}