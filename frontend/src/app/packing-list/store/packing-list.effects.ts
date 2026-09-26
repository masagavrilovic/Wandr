import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { PackingListService } from "../packing-list.service";
import { CreatePackingItemActions, DeletePackingItemActions, LoadPackingItemsActions } from "./packing-list.actions";
import { catchError, of, switchMap, map, exhaustMap, mergeMap } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";


@Injectable()
export class PackingListEffect {
    private readonly actions$ = inject(Actions);
    private readonly packingListService = inject(PackingListService);

    loadPackingItems = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadPackingItemsActions.loadPackingItems),
            switchMap(({ tripId }) => 
                this.packingListService.getAll(tripId).pipe(
                    map((items) => LoadPackingItemsActions.loadPackingItemsSuccess({ items })),
                    catchError((error: HttpErrorResponse) => of(LoadPackingItemsActions.loadPackingItemsFailure({ error: error.message })))
                )
            )
        )
    );

    createPackingItem = createEffect(() => 
        this.actions$.pipe(
            ofType(CreatePackingItemActions.createPackingItem),
            exhaustMap(({ tripId, payload }) =>
                this.packingListService.create(tripId, payload).pipe(
                    map((item) => CreatePackingItemActions.createPackingItemSuccess({ item, tripId})),
                    catchError((error: HttpErrorResponse) => of(CreatePackingItemActions.createPackingItemFailure({ error: error.message })))
                )
            )
        )
    );

    deletePackingItem = createEffect(() =>
        this.actions$.pipe(
            ofType(DeletePackingItemActions.deletePackingItem),
            mergeMap(({ tripId, id }) =>
                this.packingListService.delete(tripId, id).pipe(
                    map(() => DeletePackingItemActions.deletePackingItemSuccess({ id })),
                    catchError((error: HttpErrorResponse) => of(DeletePackingItemActions.deletePackingItemFailure({ id, error: error.message })))
                )
            )
        )
    );
}