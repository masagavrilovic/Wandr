import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { BudgetService } from "../../budget.service";
import { catchError, EMPTY, exhaustMap, map, mergeMap, of, switchMap, withLatestFrom, takeUntil, Observable } from "rxjs";
import { BudgetTabActions, CreateExpenseActions, DeleteExpenseActions, ExpenseFilterActions, LoadExpensesActions, UpdateExpenseActions } from "./expenses.actions";
import { selectExpenseCategoryFilter, selectExpenseFetchContext, selectExpenseListStatus, selectExpenseSliceTripId } from "./expenses.selectors";
import { Store } from "@ngrx/store";
import { selectSelectedTripId } from "../../../trips/store/trips.selectors";
import { extractErrorMessage } from "../../../shared/store/http-error";


@Injectable()
export class ExpensesEffect {
    private readonly actions$ = inject(Actions);
    private readonly budgetService = inject(BudgetService);
    private store = inject(Store);
    private readonly selectedTripId$ = this.store.select(selectSelectedTripId) as Observable<number>;

    loadOnTabOpen$ = createEffect(() =>
        this.actions$.pipe(
            ofType(BudgetTabActions.opened),
            withLatestFrom(
                this.store.select(selectSelectedTripId),
                this.store.select(selectExpenseSliceTripId),
                this.store.select(selectExpenseListStatus),
                this.store.select(selectExpenseCategoryFilter),
            ),
            mergeMap(([, tripId, sliceTripId, status, category]) =>
                tripId !== null && (sliceTripId !== tripId || status === 'error')
                    ? of(LoadExpensesActions.loadExpenses({tripId, category: sliceTripId === tripId ? category : null}))
                    : EMPTY
            )
        )
    );

    onCategoryChange$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ExpenseFilterActions.setCategory),
            withLatestFrom(this.store.select(selectSelectedTripId)),
            mergeMap(([{ category }, tripId]) =>
                tripId === null
                    ? EMPTY
                    : of(LoadExpensesActions.loadExpenses({ tripId, category }))
            )
        )
    );

    loadFirstPage$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadExpensesActions.loadExpenses),
            switchMap(({ tripId, category }) =>
                this.budgetService.getAll(tripId, 10, null, category).pipe(
                    map((response) => LoadExpensesActions.loadExpensesSuccess({ response, tripId, category })),
                    catchError((error) => of(LoadExpensesActions.loadExpensesFailure({ error: extractErrorMessage(error) })))
                )
            )
        )
    );


    loadNextPage$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadExpensesActions.loadMoreExpenses),
            withLatestFrom(this.store.select(selectExpenseFetchContext)),
            switchMap(([, { tripId, category, nextCursor }]) => {
                if (tripId === null || nextCursor === null) return EMPTY;

                return this.budgetService.getAll(tripId, 10, nextCursor, category).pipe(
                    map((response) => LoadExpensesActions.loadMoreExpensesSuccess({ response, tripId, category })),
                    catchError((error) => of(LoadExpensesActions.loadMoreExpensesFailure({ error: extractErrorMessage(error) }))),
                    takeUntil(this.actions$.pipe(ofType(LoadExpensesActions.loadExpenses)))
                );
            })
        )
    );
    
    createExpense$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CreateExpenseActions.createExpense),
            withLatestFrom(this.selectedTripId$),
            exhaustMap(([{ payload }, tripId]) =>
                this.budgetService.create(tripId, payload).pipe(
                    map((expense) => CreateExpenseActions.createExpenseSuccess({ expense, tripId })),
                    catchError((error) => of(CreateExpenseActions.createExpenseFailure({ error: extractErrorMessage(error) })))
                )
            )
        )
    );

    updateExpense$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UpdateExpenseActions.updateExpense),
            withLatestFrom(this.selectedTripId$),
            exhaustMap(([{ id, payload }, tripId]) =>
                this.budgetService.update(tripId, id, payload).pipe(
                    map((expense) => UpdateExpenseActions.updateExpenseSuccess({ expense, tripId })),
                    catchError((error) => of(UpdateExpenseActions.updateExpenseFailure({ error: extractErrorMessage(error) })))
                )
            )
        )
    );

    deleteExpense$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DeleteExpenseActions.deleteExpense),
            withLatestFrom(this.selectedTripId$),
            mergeMap(([{ id }, tripId]) =>
                this.budgetService.delete(tripId, id).pipe(
                    map(() => DeleteExpenseActions.deleteExpenseSuccess({ id, tripId })),
                    catchError((error) => of(DeleteExpenseActions.deleteExpenseFailure({ id, error: extractErrorMessage(error) })))
                )
            )
        )
    );
}