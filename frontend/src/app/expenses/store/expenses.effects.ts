import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ExpensesService } from "../expenses.service";
import { LoadExpensesActions } from "./expenses.actions";
import { catchError, map, of, switchMap } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";


@Injectable()
export class ExpensesEffect {
    private readonly actions$ = inject(Actions);
    private readonly expensesService = inject(ExpensesService);

    loadExpenses$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadExpensesActions.loadExpenses),
            switchMap(({ tripId }) =>
                this.expensesService.getAll(tripId).pipe(
                    map((expenses) => LoadExpensesActions.loadExpensesSuccess({ expenses })),
                    catchError((error: HttpErrorResponse) => of(LoadExpensesActions.loadExpensesFailure({ error: error.message })))
                )
            )
        )
    );
}