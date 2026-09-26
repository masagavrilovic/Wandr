import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { PackingListService } from "../packing-list.service";
import { LoadPackingItemsActions } from "./packing-list.actions";
import { catchError, of, switchMap, map } from "rxjs";
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
}