import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { CreatePaymentActions, DeletePaymentActions, LoadPaymentsActions, UpdatePaymentActions } from "./payments.actions";
import { catchError, exhaustMap, map, mergeMap, of, switchMap, withLatestFrom } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { BudgetService } from "../../budget.service";
import { Store } from "@ngrx/store";
import { selectNextPaymentCursor } from "./payments.selectors";


@Injectable()
export class PaymentsEffect {
    private readonly actions$ = inject(Actions);
    private readonly budgetService = inject(BudgetService);
    private store = inject(Store);

    loadPayments$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadPaymentsActions.loadPayment),
            withLatestFrom(this.store.select(selectNextPaymentCursor)),
            switchMap(([action, currentCursor]) => {
                const activeCursor = action.cursor !== undefined ? action.cursor : currentCursor;
                return this.budgetService.getPayments(action.tripId, action.limit, activeCursor).pipe(
                    map((response) => LoadPaymentsActions.loadPaymentSuccess({ response })),
                    catchError((error: HttpErrorResponse) => of(LoadPaymentsActions.loadPaymentFailure({ error: error.message })))
                )
            })
        )
    );

    createPayment$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CreatePaymentActions.createPayment),
            exhaustMap(({ tripId, payload }) =>
                this.budgetService.createPayment(tripId, payload).pipe(
                    map((payment) => CreatePaymentActions.createPaymentSuccess({ payment, tripId })),
                    catchError((error: HttpErrorResponse) => of(CreatePaymentActions.createPaymentFailure({ error: error.message })))
                )
            )
        )
    );

    updatePayment$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UpdatePaymentActions.updatePayment),
            exhaustMap(({ tripId, id, payload }) =>
                this.budgetService.updatePayment(tripId, id, payload).pipe(
                    map((payment) => UpdatePaymentActions.updatePaymentSuccess({ payment, tripId })),
                    catchError((error: HttpErrorResponse) => of(UpdatePaymentActions.updatePaymentFailure({ error: error.message })))
                )
            )
        )
    );

    deletePayment$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DeletePaymentActions.deletePayment),
            mergeMap(({ tripId, id }) =>
                this.budgetService.deletePayment(tripId, id).pipe(
                    map(() => DeletePaymentActions.deletePaymentSuccess({ id, tripId })),
                    catchError((error: HttpErrorResponse) => of(DeletePaymentActions.deletePaymentFailure({ id, error: error.message })))
                )
            )
        )
    );
}