import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { PackingListService } from "../packing-list.service";
import { CreatePackingItemActions, DeletePackingItemActions, LoadPackingItemsActions, PackingTabActions, TogglePackingItemActions, UpdatePackingItemActions } from "./packing-list.actions";
import { catchError, of, switchMap, map, exhaustMap, mergeMap, concatMap, EMPTY, withLatestFrom, Observable, debounceTime, groupBy } from "rxjs";
import { Store } from "@ngrx/store";
import { selectSelectedTripId } from "../../trips/store/trips.selectors";
import { selectPackingSliceTripId, selectPackingLoadStatus } from "./packing-list.selectors";
import { extractErrorMessage } from "../../shared/store/http-error";


@Injectable()
export class PackingListEffect {
    private readonly actions$ = inject(Actions);
    private readonly packingListService = inject(PackingListService);
    private readonly store = inject(Store);
    private readonly selectedTripId$ = this.store.select(selectSelectedTripId) as Observable<number>;

    loadOnTabOpen$ = createEffect(() =>
        this.actions$.pipe(
            ofType(PackingTabActions.opened),
            withLatestFrom(
                this.store.select(selectSelectedTripId),
                this.store.select(selectPackingSliceTripId),
                this.store.select(selectPackingLoadStatus),
            ),
            mergeMap(([, tripId, sliceTripId, status]) =>
                tripId !== null && (sliceTripId !== tripId || status === 'error')
                    ? of(LoadPackingItemsActions.loadPackingItems({ tripId }))
                    : EMPTY
            )
        )
    );

    
    loadPackingItems$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadPackingItemsActions.loadPackingItems),
            switchMap(({ tripId }) =>
                this.packingListService.getAll(tripId).pipe(
                    map((items) => LoadPackingItemsActions.loadPackingItemsSuccess({ items, tripId })),
                    catchError((error) => of(LoadPackingItemsActions.loadPackingItemsFailure({ error: extractErrorMessage(error) })))
                )
            )
        )
    );

    createPackingItem$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CreatePackingItemActions.createPackingItem),
            withLatestFrom(this.selectedTripId$),
            exhaustMap(([{ payload }, tripId]) =>
                this.packingListService.create(tripId, payload).pipe(
                    map((item) => CreatePackingItemActions.createPackingItemSuccess({ item, tripId })),
                    catchError((error) => of(CreatePackingItemActions.createPackingItemFailure({ error: extractErrorMessage(error) })))
                )
            )
        )
    );

    updatePackingItem$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UpdatePackingItemActions.updatePackingItem),
            withLatestFrom(this.selectedTripId$),
            exhaustMap(([{ id, payload }, tripId]) =>
                this.packingListService.update(tripId, id, payload).pipe(
                    map((item) => UpdatePackingItemActions.updatePackingItemSuccess({ item, tripId })),
                    catchError((error) => of(UpdatePackingItemActions.updatePackingItemFailure({ error: extractErrorMessage(error) })))
                )
            )
        )
    );

    deletePackingItem$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DeletePackingItemActions.deletePackingItem),
            withLatestFrom(this.selectedTripId$),
            mergeMap(([{ id }, tripId]) =>
                this.packingListService.delete(tripId, id).pipe(
                    map(() => DeletePackingItemActions.deletePackingItemSuccess({ id, tripId })),
                    catchError((error) => of(DeletePackingItemActions.deletePackingItemFailure({ id, error: extractErrorMessage(error) })))
                )
            )
        )
    );

    togglePackingItem$ = createEffect(() =>
        this.actions$.pipe(
            ofType(TogglePackingItemActions.togglePackingItem),
            withLatestFrom(this.selectedTripId$),
            groupBy(([action]) => action.id, {
                duration: (group$) => group$.pipe(debounceTime(10_000)),
            }),
            mergeMap((group$) =>
                group$.pipe(
                    concatMap(([action, tripId]) =>
                        this.packingListService.update(tripId, action.id, { assigned: action.assigned }).pipe(
                            map((item) => TogglePackingItemActions.togglePackingItemSuccess({ item, tripId })),
                            catchError((error) =>
                                of(TogglePackingItemActions.togglePackingItemFailure({
                                    id: action.id,
                                    previousAssignedTo: action.previousAssignedTo,
                                    error: extractErrorMessage(error),
                                }))
                            )
                        )
                    )
                )
            )
        )
    );
}