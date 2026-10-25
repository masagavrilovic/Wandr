import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { CreatePaymentActions, DeletePaymentActions, LoadPaymentsActions, UpdatePaymentActions } from "./payments.actions";
import { catchError, EMPTY, exhaustMap, takeUntil, map, mergeMap, of, switchMap, withLatestFrom, Observable } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { BudgetService } from "../../budget.service";
import { Store } from "@ngrx/store";
import { selectNextPaymentCursor, selectPaymentsListStatus, selectPaymentsSliceTripId } from "./payments.selectors";
import { BudgetTabActions } from "../../expenses/store/expenses.actions";
import { selectSelectedTripId } from "../../../trips/store/trips.selectors";
import { extractErrorMessage } from "../../../shared/store/http-error";


@Injectable()
export class PaymentsEffect {
    private readonly actions$ = inject(Actions);
    private readonly budgetService = inject(BudgetService);
    private store = inject(Store);
    private readonly selectedTripId$ = this.store.select(selectSelectedTripId) as Observable<number>;

     loadOnTabOpen$ = createEffect(() =>
        this.actions$.pipe(
            ofType(BudgetTabActions.opened),
            withLatestFrom(
                this.store.select(selectSelectedTripId),
                this.store.select(selectPaymentsSliceTripId),
                this.store.select(selectPaymentsListStatus),
            ),
            mergeMap(([, tripId, sliceTripId, status]) =>
                tripId !== null && (sliceTripId !== tripId || status === 'error')
                    ? of(LoadPaymentsActions.loadPayments({ tripId }))
                    : EMPTY
            )
        )
    );

    loadPayments$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadPaymentsActions.loadPayments),
            switchMap(({ tripId }) =>
                this.budgetService.getPayments(tripId, 10, null).pipe(
                    map((response) => LoadPaymentsActions.loadPaymentsSuccess({ response, tripId })),
                    catchError((error: unknown) => of(LoadPaymentsActions.loadPaymentsFailure({ error: extractErrorMessage(error) })))
                )
            )
        )
    );

     loadMorePayments$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadPaymentsActions.loadMorePayments),
            withLatestFrom(
                this.store.select(selectSelectedTripId),
                this.store.select(selectNextPaymentCursor),
            ),
            switchMap(([, tripId, cursor]) => {
                if (tripId === null || cursor === null) return EMPTY;

                return this.budgetService.getPayments(tripId, 10, cursor).pipe(
                    map((response) => LoadPaymentsActions.loadMorePaymentsSuccess({ response, tripId })),
                    catchError((error: unknown) => of(LoadPaymentsActions.loadMorePaymentsFailure({ error: extractErrorMessage(error) }))),
                    takeUntil(this.actions$.pipe(ofType(LoadPaymentsActions.loadPayments)))
                );
            })
        )
    );


    createPayment$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CreatePaymentActions.createPayment),
            withLatestFrom(this.selectedTripId$),
            exhaustMap(([{ payload }, tripId]) =>
                this.budgetService.createPayment(tripId, payload).pipe(
                    map((payment) => CreatePaymentActions.createPaymentSuccess({ payment, tripId })),
                    catchError((error: unknown) => of(CreatePaymentActions.createPaymentFailure({ error: extractErrorMessage(error) })))
                )
            )
        )
    );


    updatePayment$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UpdatePaymentActions.updatePayment),
            withLatestFrom(this.selectedTripId$),
            exhaustMap(([{ id, payload }, tripId]) =>
                this.budgetService.updatePayment(tripId, id, payload).pipe(
                    map((payment) => UpdatePaymentActions.updatePaymentSuccess({ payment, tripId })),
                    catchError((error: unknown) => of(UpdatePaymentActions.updatePaymentFailure({ error: extractErrorMessage(error) })))
                )
            )
        )
    );

    deletePayment$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DeletePaymentActions.deletePayment),
            withLatestFrom(this.selectedTripId$),
            mergeMap(([{ id }, tripId]) =>
                this.budgetService.deletePayment(tripId, id).pipe(
                    map(() => DeletePaymentActions.deletePaymentSuccess({ id, tripId })),
                    catchError((error: unknown) => of(DeletePaymentActions.deletePaymentFailure({ id, error: extractErrorMessage(error) })))
                )
            )
        )
    );
}