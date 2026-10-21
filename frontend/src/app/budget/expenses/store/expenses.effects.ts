import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { BudgetService } from "../../budget.service";
import { catchError, exhaustMap, map, mergeMap, of, switchMap } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { CreateExpenseActions, DeleteExpenseActions, LoadExpensesActions, UpdateExpenseActions } from "./expenses.actions";


@Injectable()
export class ExpensesEffect {
    private readonly actions$ = inject(Actions);
    private readonly budgetService = inject(BudgetService);

    loadExpenses$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadExpensesActions.loadExpenses),
            switchMap(({ tripId }) =>
                this.budgetService.getAll(tripId).pipe(
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