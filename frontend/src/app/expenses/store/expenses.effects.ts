import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ExpensesService } from "../expenses.service";
import { CreateExpenseActions, CreatePaymentActions, DeleteExpenseActions, DeletePaymentActions, LoadExpensesActions, LoadPaymentsActions, LoadSettlementsActions, UpdateExpenseActions, UpdatePaymentActions } from "./expenses.actions";
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

    deleteExpense$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DeleteExpenseActions.deleteExpense),
            mergeMap(({ tripId, id }) =>
                this.expensesService.delete(tripId, id).pipe(
                    map(() => DeleteExpenseActions.deleteExpenseSuccess({ id, tripId })),
                    catchError((error: HttpErrorResponse) => of(DeleteExpenseActions.deleteExpenseFailure({ id, error: error.message })))
                )
            )
        )
    );

    loadPayments$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadPaymentsActions.loadPayment),
            switchMap(({ tripId }) =>
                this.expensesService.getPayments(tripId).pipe(
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
                this.expensesService.createPayment(tripId, payload).pipe(
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
                this.expensesService.updatePayment(tripId, id, payload).pipe(
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
                this.expensesService.deletePayment(tripId, id).pipe(
                    map(() => DeletePaymentActions.deletePaymentSuccess({ id, tripId })),
                    catchError((error: HttpErrorResponse) => of(DeletePaymentActions.deletePaymentFailure({ id, error: error.message })))
                )
            )
        )
    );

    loadSettlements$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadSettlementsActions.loadSettlements),
            switchMap(({ tripId }) =>
                this.expensesService.getSettlements(tripId).pipe(
                    map((settlement) => LoadSettlementsActions.loadSettlementsSuccess({ settlement })),
                    catchError((error: HttpErrorResponse) => of(LoadSettlementsActions.loadSettlementsFailure({ error: error.message })))
                )
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
            map(({ tripId }) => LoadSettlementsActions.loadSettlements({ tripId }))
        )
    );
}