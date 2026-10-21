import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { CreatePaymentPayload, Payment, UpdatePaymentPayload } from "../payments.models";

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