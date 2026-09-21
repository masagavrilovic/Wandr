import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, exhaustMap, map, mergeMap, of, switchMap, tap } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { ActivityService } from "../activities.service";
import { CreateActivityActions, DeleteActivityActions, LoadActivitiesActions } from "./activites.actions";
import { Router } from "@angular/router";

@Injectable()
export class ActivityEffect {
    private readonly actions$ = inject(Actions);
    private readonly activityService = inject(ActivityService);
    private readonly router = inject(Router);
    
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

    createActivity = createEffect(() =>
        this.actions$.pipe(
            ofType(CreateActivityActions.createActivity),
            exhaustMap(({ tripId, payload }) =>
                this.activityService.create(tripId, payload).pipe(
                    map((activity) => CreateActivityActions.createActivitySuccess({ activity, tripId })),
                    catchError((error: HttpErrorResponse) => of(CreateActivityActions.createActivityFailure({ error: error.message })))
                )
            )
        )
    );

    deleteActivity = createEffect(() =>
        this.actions$.pipe(
            ofType(DeleteActivityActions.deleteActivity),
            mergeMap(({ tripId, id }) =>
                this.activityService.delete(tripId, id).pipe(
                    map(() => DeleteActivityActions.deleteActivitySuccess({ id })),
                    catchError((error: HttpErrorResponse) => of(DeleteActivityActions.deleteActivityFailure({ id, error: error.message })))
                )
            )
        )
    );
}