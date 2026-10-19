import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";
import { Payment } from "../expenses.models";
import { CreatePaymentActions, DeletePaymentActions, LoadPaymentsActions } from "./expenses.actions";

export interface PaymentsState extends EntityState<Payment> {
    isLoading: boolean;
    loadingError: string | null;
    tripId: number | null;

    isCreating: boolean;
    createError: string | null;

    deletingIds: number[];
    deleteErrors: { id: number; message: string }[];
}

export const paymentsAdapter: EntityAdapter<Payment> = createEntityAdapter<Payment>({
    sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

export const initialState: PaymentsState = paymentsAdapter.getInitialState({
    isLoading: false,
    loadingError: null,
    tripId: null,

    isCreating: false,
    createError: null,

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