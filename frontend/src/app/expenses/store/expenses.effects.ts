import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ExpensesService } from "../expenses.service";
import { CreateExpenseActions, LoadExpensesActions, UpdateExpenseActions } from "./expenses.actions";
import { catchError, exhaustMap, map, mergeMap, of, switchMap } from "rxjs";
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

    createExpense$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CreateExpenseActions.createExpense),
            exhaustMap(({ tripId, payload }) =>
                this.expensesService.create(tripId, payload).pipe(
                    map((expense) => CreateExpenseActions.createExpenseSuccess({ expense, tripId })),
                    catchError((error: HttpErrorResponse) => of (CreateExpenseActions.createExpenseFailure({ error: error.message })))
                )
            )
        )
    );

    updateExpense$ = createEffect(() => 
        this.actions$.pipe(
            ofType(UpdateExpenseActions.updateExpense),
            exhaustMap(({ tripId, id, payload }) =>
                this.expensesService.update(tripId, id, payload).pipe(
                    map((expense) => UpdateExpenseActions.updateExpenseSuccess({ expense, tripId })),
                    catchError((error: HttpErrorResponse) => of(UpdateExpenseActions.updateExpenseFailure({ error: error.message })))
                )
            )
        )
    );
}