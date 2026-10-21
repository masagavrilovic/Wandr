import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { CreatePaymentActions, DeletePaymentActions, LoadPaymentsActions, UpdatePaymentActions } from "./payments.actions";
import { catchError, exhaustMap, map, mergeMap, of, switchMap } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { BudgetService } from "../../budget.service";


@Injectable()
export class PaymentsEffect {
    private readonly actions$ = inject(Actions);
    private readonly budgetService = inject(BudgetService);

    loadPayments$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadPaymentsActions.loadPayment),
            switchMap(({ tripId }) =>
                this.budgetService.getPayments(tripId).pipe(
                    map((payments) => LoadPaymentsActions.loadPaymentSuccess({ payments })),
                    catchError((error: HttpErrorResponse) => of(LoadPaymentsActions.loadPaymentFailure({ error: error.message })))
                )
            )
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