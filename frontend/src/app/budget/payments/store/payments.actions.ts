import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { CreatePaymentPayload, Payment, UpdatePaymentPayload } from "../payments.models";
import { PaginatedResponse } from "../../../shared/pagination.models";

export const LoadPaymentsActions = createActionGroup({
    source: 'Payments',
    events: {
        'Load Payments': props<{ tripId: number, limit?: number, cursor?: number | null }>(),
        'Load Payments Success': props<{ response: PaginatedResponse<Payment>, tripId: number }>(),
        'Load Payments Failure': props<{ error: string }>(),

        'Load More Payments': emptyProps(),
        'Load More Payments Success': props<{ response: PaginatedResponse<Payment>, tripId: number }>(),
        'Load More Payments Failure': props<{ error: string }>(),
    }
});

export const CreatePaymentActions = createActionGroup({
    source: 'Payments',
    events: {
        'Create Payment': props<{ payload: CreatePaymentPayload }>(),
        'Create Payment Success': props<{ payment: Payment, tripId: number }>(),
        'Create Payment Failure': props<{ error: string }>(),
        'Clear Create Error': emptyProps(),
    }
});

export const UpdatePaymentActions = createActionGroup({
    source: 'Payments',
    events: {
        'Update Payment': props<{ id: number, payload: UpdatePaymentPayload }>(),
        'Update Payment Success': props<{ payment: Payment, tripId: number }>(),
        'Update Payment Failure': props<{ error: string }>(),
        'Clear Update Error': emptyProps(),
    }
});

export const DeletePaymentActions = createActionGroup({
    source: 'Payments',
    events: {
        'Delete Payment': props<{ id: number }>(),
        'Delete Payment Success': props<{ id: number, tripId: number }>(),
        'Delete Payment Failure': props<{ id: number, error: string }>(),
        'Clear Delete Error': props<{ id: number }>(),
    }
});