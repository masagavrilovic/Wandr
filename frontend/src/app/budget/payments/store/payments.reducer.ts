import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";
import { CreatePaymentActions, DeletePaymentActions, LoadPaymentsActions, UpdatePaymentActions } from "./payments.actions";
import { Payment } from "../payments.models";
import { failedOp, initialOperation, loadingOp, OperationState, successOp } from "../../../shared/store/operation-state";

export interface PaymentsState extends EntityState<Payment> {
    tripId: number | null;
    nextCursor: number | null;
    hasNextPage: boolean;

    list: OperationState;
    more: OperationState;
    create: OperationState;
    update: OperationState;

    deletingIds: number[];
    deleteErrors: { id: number; message: string }[];
}

export const paymentsAdapter: EntityAdapter<Payment> = createEntityAdapter<Payment>({
    sortComparer: (a, b) => b.id - a.id,
});

export const initialState: PaymentsState = paymentsAdapter.getInitialState({
    tripId: null,
    nextCursor: null,
    hasNextPage: false,

    list: initialOperation,
    more: initialOperation,
    create: initialOperation,
    update: initialOperation,

    deletingIds: [],
    deleteErrors: [],
});

export const paymentsReducer = createReducer(
    initialState,
    on(LoadPaymentsActions.loadPayments, (state, { tripId }) => {
        const tripChanged = state.tripId !== tripId;
        const base: PaymentsState = tripChanged
            ? paymentsAdapter.removeAll({
                ...state,
                nextCursor: null,
                hasNextPage: false,
                create: initialOperation,
                update: initialOperation,
                deletingIds: [],
                deleteErrors: [],
            })
            : state;
        return { ...base, tripId, list: loadingOp(), more: initialOperation };
    }),
    on(LoadPaymentsActions.loadPaymentsSuccess, (state, { response, tripId }) => {
        if (state.tripId !== tripId) return state;
        return paymentsAdapter.setAll(response.data, {
            ...state,
            list: successOp(),
            nextCursor: response.nextCursor,
            hasNextPage: response.hasNextPage,
        });
    }),
    on(LoadPaymentsActions.loadPaymentsFailure, (state, { error }) => ({
        ...state,
        list: failedOp(error)
    })),
        on(LoadPaymentsActions.loadMorePayments, (state) => ({
        ...state, more: loadingOp(),
    })),
    on(LoadPaymentsActions.loadMorePaymentsSuccess, (state, { response, tripId }) => {
        if (state.tripId !== tripId) return state;
        return paymentsAdapter.upsertMany(response.data, {
            ...state,
            more: successOp(),
            nextCursor: response.nextCursor,
            hasNextPage: response.hasNextPage,
        });
    }),
    on(LoadPaymentsActions.loadMorePaymentsFailure, (state, { error }) => ({
        ...state, more: failedOp(error),
    })),
    on(CreatePaymentActions.createPayment, (state) => ({ ...state, create: loadingOp() })),
    on(CreatePaymentActions.createPaymentSuccess, (state, { payment, tripId }) => {
        if (state.tripId !== tripId) return state;
        return paymentsAdapter.upsertOne(payment, { ...state, create: successOp() });
    }),
    on(CreatePaymentActions.createPaymentFailure, (state, { error }) => ({ ...state, create: failedOp(error) })),
    on(CreatePaymentActions.clearCreateError, (state) => ({ ...state, create: initialOperation })),

    on(UpdatePaymentActions.updatePayment, (state) => ({ ...state, update: loadingOp() })),
    on(UpdatePaymentActions.updatePaymentSuccess, (state, { payment, tripId }) => {
        if (state.tripId !== tripId) return state;
        return paymentsAdapter.updateOne({ id: payment.id, changes: payment }, { ...state, update: successOp() });
    }),
    on(UpdatePaymentActions.updatePaymentFailure, (state, { error }) => ({ ...state, update: failedOp(error) })),
    on(UpdatePaymentActions.clearUpdateError, (state) => ({ ...state, update: initialOperation })),

    on(DeletePaymentActions.deletePayment, (state, { id }) => ({
        ...state,
        deletingIds: [...state.deletingIds, id],
        deleteErrors: state.deleteErrors.filter((e) => e.id !== id),
    })),
    on(DeletePaymentActions.deletePaymentSuccess, (state, { id, tripId }) => {
        if (state.tripId !== tripId) return state;
        return paymentsAdapter.removeOne(id, {
            ...state,
            deletingIds: state.deletingIds.filter((x) => x !== id),
        });
    }),
    on(DeletePaymentActions.deletePaymentFailure, (state, { id, error }) => ({
        ...state,
        deletingIds: state.deletingIds.filter((x) => x !== id),
        deleteErrors: [...state.deleteErrors, { id, message: error }],
    })),
    on(DeletePaymentActions.clearDeleteError, (state, { id }) => ({
        ...state,
        deleteErrors: state.deleteErrors.filter((e) => e.id !== id),
    })),
);