import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { BudgetService } from "../../budget.service";
import { catchError, EMPTY, filter, map, mergeMap, of, switchMap, withLatestFrom } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { LoadSettlementsActions, LoadSpendingActions } from "./summary.actions";
import { BudgetTabActions, CreateExpenseActions, DeleteExpenseActions, UpdateExpenseActions } from "../../expenses/store/expenses.actions";
import { CreatePaymentActions, DeletePaymentActions, UpdatePaymentActions } from "../../payments/store/payments.actions";
import { Store } from "@ngrx/store";
import { selectSelectedTripId } from "../../../trips/store/trips.selectors";
import { selectSettlementsStatus, selectSpendingStatus, selectSummarySliceTripId } from "./summary.selectors";
import { extractErrorMessage } from "../../../shared/store/http-error";


@Injectable()
export class SummaryEffect {
    private readonly actions$ = inject(Actions);
    private readonly budgetService = inject(BudgetService);
     private readonly store = inject(Store);

    loadSettlementsOnTabOpen$ = createEffect(() =>
        this.actions$.pipe(
            ofType(BudgetTabActions.opened),
            withLatestFrom(
                this.store.select(selectSelectedTripId),
                this.store.select(selectSummarySliceTripId),
                this.store.select(selectSettlementsStatus),
            ),
            mergeMap(([, tripId, sliceTripId, status]) =>
                tripId !== null && (sliceTripId !== tripId || status === 'idle' || status === 'error')
                    ? of(LoadSettlementsActions.loadSettlements({ tripId }))
                    : EMPTY
            )
        )
    );

    loadSpendingOnTabOpen$ = createEffect(() =>
        this.actions$.pipe(
            ofType(BudgetTabActions.opened),
            withLatestFrom(
                this.store.select(selectSelectedTripId),
                this.store.select(selectSummarySliceTripId),
                this.store.select(selectSpendingStatus),
            ),
            mergeMap(([, tripId, sliceTripId, status]) =>
                tripId !== null && (sliceTripId !== tripId || status === 'idle' || status === 'error')
                    ? of(LoadSpendingActions.loadSpending({ tripId }))
                    : EMPTY
            )
        )
    );
    
    refreshSettlements$ = createEffect(() =>
        this.actions$.pipe(
            ofType(
                CreateExpenseActions.createExpenseSuccess,
                UpdateExpenseActions.updateExpenseSuccess,
                DeleteExpenseActions.deleteExpenseSuccess,
                CreatePaymentActions.createPaymentSuccess,
                UpdatePaymentActions.updatePaymentSuccess,
                DeletePaymentActions.deletePaymentSuccess,
            ),
            withLatestFrom(this.store.select(selectSelectedTripId)),
            filter(([action, selectedTripId]) => action.tripId === selectedTripId),
            map(([{ tripId }]) => LoadSettlementsActions.loadSettlements({ tripId }))
        )
    );

     loadSettlements$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadSettlementsActions.loadSettlements),
            switchMap(({ tripId }) =>
                this.budgetService.getSettlements(tripId).pipe(
                    map((settlement) => LoadSettlementsActions.loadSettlementsSuccess({ settlement, tripId })),
                    catchError((error: unknown) => of(LoadSettlementsActions.loadSettlementsFailure({ error: extractErrorMessage(error) })))
                )
            )
        )
    );

    loadSpending$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadSpendingActions.loadSpending),
            switchMap(({ tripId }) =>
                this.budgetService.getSpendingByCategory(tripId).pipe(
                    map((spending) => LoadSpendingActions.loadSpendingSuccess({ spending, tripId })),
                    catchError((error: unknown) => of(LoadSpendingActions.loadSpendingFailure({ error: extractErrorMessage(error) })))
                )
            )
        )
    );

    refreshSpending$ = createEffect(() =>
        this.actions$.pipe(
            ofType(
                CreateExpenseActions.createExpenseSuccess,
                UpdateExpenseActions.updateExpenseSuccess,
                DeleteExpenseActions.deleteExpenseSuccess,
            ),
            withLatestFrom(this.store.select(selectSelectedTripId)),
            filter(([action, selectedTripId]) => action.tripId === selectedTripId),
            map(([{ tripId }]) => LoadSpendingActions.loadSpending({ tripId }))
        )
    );
}