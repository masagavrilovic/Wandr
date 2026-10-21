import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { BudgetService } from "../../budget.service";
import { catchError, map, of, switchMap } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { LoadSettlementsActions } from "./summary.actions";
import { CreateExpenseActions, DeleteExpenseActions, UpdateExpenseActions } from "../../expenses/store/expenses.actions";
import { CreatePaymentActions, DeletePaymentActions, UpdatePaymentActions } from "../../payments/store/payments.actions";


@Injectable()
export class SummaryEffect {
    private readonly actions$ = inject(Actions);
    private readonly budgetService = inject(BudgetService);

    loadSettlements$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadSettlementsActions.loadSettlements),
            switchMap(({ tripId }) =>
                this.budgetService.getSettlements(tripId).pipe(
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