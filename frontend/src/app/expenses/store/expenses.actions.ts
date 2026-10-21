import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { CreateExpensePayload, CreatePaymentPayload, Expense, Payment, Settlement, UpdateExpensePayload, UpdatePaymentPayload } from "../expenses.models";

export const LoadExpensesActions = createActionGroup({
    source: 'Expenses',
    events: {
        'Load Expenses': props<{ tripId: number }>(),
        'Load Expenses Success': props<{ expenses: Expense[] }>(),
        'Load Expenses Failure': props<{ error: string }>(),
    }
});

export const CreateExpenseActions = createActionGroup({
    source: 'Expenses',
    events: {
        'Create Expense': props<{ tripId: number, payload: CreateExpensePayload }>(),
        'Create Expense Success': props<{ expense: Expense, tripId: number }>(),
        'Create Expense Failure': props<{ error: string }>(),
        'Clear Create Error': emptyProps(),
    }
});

export const UpdateExpenseActions = createActionGroup({
  source: 'Expenses',
  events: {
        'Update Expense': props<{ tripId: number, id: number, payload: UpdateExpensePayload }>(),
        'Update Expense Success': props<{ expense: Expense, tripId: number }>(),
        'Update Expense Failure': props<{ error: string }>(),
        'Clear Update Error': emptyProps(),
  }
});

export const DeleteExpenseActions = createActionGroup({
    source: 'Expenses',
    events: {
        'Delete Expense': props<{ tripId: number, id: number }>(),
        'Delete Expense Success': props<{ id: number, tripId: number }>(),
        'Delete Expense Failure': props<{ id: number, error: string }>(),
        'Clear Delete Error': props<{ id: number }>(),
    }
});

export const LoadPaymentsActions = createActionGroup({
    source: 'Payments',
    events: {
        'Load Payment': props<{ tripId: number }>(),
        'Load Payment Success': props<{ payments: Payment[] }>(),
        'Load Payment Failure': props<{ error: string }>(),
    }
});

export const CreatePaymentActions = createActionGroup({
    source: 'Payments',
    events: {
        'Create Payment': props<{ tripId: number, payload: CreatePaymentPayload }>(),
        'Create Payment Success': props<{ payment: Payment, tripId: number }>(),
        'Create Payment Failure': props<{ error: string }>(),
        'Clear Create Error': emptyProps(),
    }
});

export const UpdatePaymentActions = createActionGroup({
    source: 'Payments',
    events: {
        'Update Payment': props<{ tripId: number, id: number, payload: UpdatePaymentPayload }>(),
        'Update Payment Success': props<{ payment: Payment, tripId: number }>(),
        'Update Payment Failure': props<{ error: string }>(),
        'Clear Update Error': emptyProps(),
    }
});

export const DeletePaymentActions = createActionGroup({
    source: 'Payments',
    events: {
        'Delete Payment': props<{ tripId: number, id: number }>(),
        'Delete Payment Success': props<{ id: number, tripId: number }>(),
        'Delete Payment Failure': props<{ id: number, error: string }>(),
        'Clear Delete Error': props<{ id: number }>(),
    }
});

export const LoadSettlementsActions = createActionGroup({
    source: 'Settlements',
    events: {
        'Load Settlements': props<{ tripId: number }>(),
        'Load Settlements Success': props<{ settlement: Settlement }>(),
        'Load Settlements Failure': props<{ error: string }>(),
    }
});