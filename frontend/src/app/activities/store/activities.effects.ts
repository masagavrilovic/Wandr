import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, exhaustMap, filter, map, mergeMap, of, switchMap, withLatestFrom } from "rxjs";
import { ActivityService } from "../activities.service";
import { CreateActivityActions, DeleteActivityActions, ItineraryTabActions, LoadActivitiesActions, UpdateActivityActions } from "./activities.actions";
import { Store } from "@ngrx/store";
import { selectSelectedTripId } from "../../trips/store/trips.selectors";
import { extractErrorMessage } from "../../shared/store/http-error";
import { selectActivitiesLoadStatus, selectActivitiesSliceTripId } from "./activities.selectors";

@Injectable()
export class ActivityEffect {
    private readonly actions$ = inject(Actions);
    private readonly activityService = inject(ActivityService);
    private readonly store = inject(Store);
    private readonly tripId$ = this.store.select(selectSelectedTripId).pipe(filter((id) => id !== null));

    loadOnTabOpen$ = createEffect(() =>
        this.actions$.pipe(
        ofType(ItineraryTabActions.opened),
        withLatestFrom(
            this.store.select(selectSelectedTripId),
            this.store.select(selectActivitiesSliceTripId),
            this.store.select(selectActivitiesLoadStatus),
        ),
        filter(
            ([, tripId, sliceTripId, status]) =>
            tripId !== null && (sliceTripId !== tripId || status === 'error'),
        ),
        map(([, tripId]) => LoadActivitiesActions.loadActivities({ tripId: tripId! })),
        ),
    );
    
    loadActivities = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadActivitiesActions.loadActivities),
            switchMap(({ tripId }) => 
                this.activityService.getAll(tripId).pipe(
                    map((activities) => LoadActivitiesActions.loadActivitiesSuccess({ activities, tripId })),
                    catchError((error) => of(LoadActivitiesActions.loadActivitiesFailure({ error: extractErrorMessage(error) })))
                )
            )
        )
    );

    createActivity$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CreateActivityActions.createActivity),
            withLatestFrom(this.tripId$),
            exhaustMap(([{ payload }, tripId]) =>
                this.activityService.create(tripId, payload).pipe(
                    map((activity) => CreateActivityActions.createActivitySuccess({ activity, tripId })),
                    catchError((error) => of(CreateActivityActions.createActivityFailure({ error: extractErrorMessage(error) }))),
                ),
            ),
        ),
    );

    updateActivity$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UpdateActivityActions.updateActivity),
            withLatestFrom(this.tripId$),
            exhaustMap(([{ id, payload }, tripId]) =>
                this.activityService.update(tripId, id, payload).pipe(
                    map((activity) => UpdateActivityActions.updateActivitySuccess({ activity, tripId })),
                    catchError((error) => of(UpdateActivityActions.updateActivityFailure({ error: extractErrorMessage(error) }))),
                ),
            ),
        ),
    );

    deleteActivity$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DeleteActivityActions.deleteActivity),
            withLatestFrom(this.tripId$),
            mergeMap(([{ id }, tripId]) =>
                this.activityService.delete(tripId, id).pipe(
                    map(() => DeleteActivityActions.deleteActivitySuccess({ id, tripId })),
                    catchError((error) => of(DeleteActivityActions.deleteActivityFailure({ id, error: extractErrorMessage(error) }))),
                ),
            ),
        ),
    );
}