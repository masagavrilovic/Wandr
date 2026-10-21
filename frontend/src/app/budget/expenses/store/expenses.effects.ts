import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { BudgetService } from "../../budget.service";
import { catchError, exhaustMap, map, mergeMap, of, switchMap, withLatestFrom } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { CreateExpenseActions, DeleteExpenseActions, LoadExpensesActions, UpdateExpenseActions } from "./expenses.actions";
import { selectNextCursor } from "./expenses.selectors";
import { Store } from "@ngrx/store";


@Injectable()
export class ExpensesEffect {
    private readonly actions$ = inject(Actions);
    private store = inject(Store);
    private readonly budgetService = inject(BudgetService);

    loadExpenses$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadExpensesActions.loadExpenses),
            withLatestFrom(this.store.select(selectNextCursor)),
            switchMap(([action, currentCursor]) => {
            const activeCursor = action.cursor !== undefined ? action.cursor : currentCursor;

            return this.budgetService.getAll(action.tripId, action.limit, activeCursor).pipe(
                map((response) => LoadExpensesActions.loadExpensesSuccess({ response })),
                catchError((error) => of(LoadExpensesActions.loadExpensesFailure({ error })))
            );
            })
        )
    );

    createExpense$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CreateExpenseActions.createExpense),
            exhaustMap(({ tripId, payload }) =>
                this.budgetService.create(tripId, payload).pipe(
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
                this.budgetService.update(tripId, id, payload).pipe(
                    map((expense) => UpdateExpenseActions.updateExpenseSuccess({ expense, tripId })),
                    catchError((error: HttpErrorResponse) => of(UpdateExpenseActions.updateExpenseFailure({ error: error.message })))
                )
            )
        )
    );

    deleteExpense$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DeleteExpenseActions.deleteExpense),
            mergeMap(({ tripId, id }) =>
                this.budgetService.delete(tripId, id).pipe(
                    map(() => DeleteExpenseActions.deleteExpenseSuccess({ id, tripId })),
                    catchError((error: HttpErrorResponse) => of(DeleteExpenseActions.deleteExpenseFailure({ id, error: error.message })))
                )
            )
        )
    );
}