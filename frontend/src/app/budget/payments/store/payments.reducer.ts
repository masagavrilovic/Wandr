import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";
import { CreatePaymentActions, DeletePaymentActions, LoadPaymentsActions, UpdatePaymentActions } from "./payments.actions";
import { Payment } from "../payments.models";

export interface PaymentsState extends EntityState<Payment> {
    isLoading: boolean;
    loadingError: string | null;
    tripId: number | null;

    isCreating: boolean;
    createError: string | null;

    isUpdating: boolean;
    updateError: string | null;

    deletingIds: number[];
    deleteErrors: { id: number; message: string }[];
}

export const paymentsAdapter: EntityAdapter<Payment> = createEntityAdapter<Payment>({
    sortComparer: (a, b) => b.paidAt.localeCompare(a.paidAt),
});

export const initialState: PaymentsState = paymentsAdapter.getInitialState({
    isLoading: false,
    loadingError: null,
    tripId: null,

    isCreating: false,
    createError: null,

    isUpdating: false,
    updateError: null,

    deletingIds: [],
    deleteErrors: [],
});

export const paymentsReducer = createReducer(
    initialState,
    on(LoadPaymentsActions.loadPayment, (state, { tripId }) => ({
        ...state, isLoading: true, loadingError: null, tripId,
    })),
    on(LoadPaymentsActions.loadPaymentSuccess, (state, { payments }) =>
        paymentsAdapter.setAll(payments, { ...state, isLoading: false })
    ),
    on(LoadPaymentsActions.loadPaymentFailure, (state, { error }) => ({
        ...state, isLoading: false, loadingError: error,
    })),

    on(CreatePaymentActions.createPayment, (state) => ({
        ...state, isCreating: true, createError: null,
    })),
    on(CreatePaymentActions.createPaymentSuccess, (state, { payment }) =>
        paymentsAdapter.addOne(payment, { ...state, isCreating: false })
    ),
    on(CreatePaymentActions.createPaymentFailure, (state, { error }) => ({
        ...state, isCreating: false, createError: error,
    })),
    on(CreatePaymentActions.clearCreateError, (state) => ({
        ...state, createError: null,
    })),
    on(UpdatePaymentActions.updatePayment, (state) => ({
        ...state, 
        isUpdating: true, 
        updateError: null,
    })),
    on(UpdatePaymentActions.updatePaymentSuccess, (state, { payment }) =>
        paymentsAdapter.updateOne({ id: payment.id, changes: payment }, { 
            ...state, 
            isUpdating: false
    })),
    on(UpdatePaymentActions.updatePaymentFailure, (state, { error }) => ({
        ...state, 
        isUpdating: false, 
        updateError: error,
    })),
    on(UpdatePaymentActions.clearUpdateError, (state) => ({
        ...state, 
        updateError: null,
    })),
    on(DeletePaymentActions.deletePayment, (state, { id }) => ({
        ...state,
        deletingIds: [...state.deletingIds, id],
        deleteErrors: state.deleteErrors.filter(e => e.id !== id),
    })),
    on(DeletePaymentActions.deletePaymentSuccess, (state, { id }) =>
        paymentsAdapter.removeOne(id, {
            ...state,
            deletingIds: state.deletingIds.filter(x => x !== id),
        })
    ),
    on(DeletePaymentActions.deletePaymentFailure, (state, { id, error }) => ({
        ...state,
        deletingIds: state.deletingIds.filter(x => x !== id),
        deleteErrors: [...state.deleteErrors, { id, message: error }],
    })),
    on(DeletePaymentActions.clearDeleteError, (state, { id }) => ({
        ...state,
        deleteErrors: state.deleteErrors.filter(e => e.id !== id),
    })),
);