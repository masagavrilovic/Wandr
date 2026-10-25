import { createFeatureSelector, createSelector } from "@ngrx/store";
import { paymentsAdapter, PaymentsState } from "./payments.reducer";
import { selectSelectedTripId } from "../../../trips/store/trips.selectors";
import { Payment } from "../payments.models";

export const paymentsFeature = createFeatureSelector<PaymentsState>('payments');
const {  selectAll: selectAllRaw } = paymentsAdapter.getSelectors(paymentsFeature);

export const selectPaymentsSliceTripId = createSelector(paymentsFeature, (s) => s.tripId);
export const selectPaymentsListStatus = createSelector(paymentsFeature, (s) => s.list.status);

export const selectPaymentsStateForSelectedTrip = createSelector(
    paymentsFeature,
    selectSelectedTripId,
    (state, id): PaymentsState | null => (id !== null && state.tripId === id ? state : null),
);

export const selectAllPayments = createSelector(
    selectAllRaw,
    selectPaymentsStateForSelectedTrip,
    (all, state): Payment[] => (state ? all : []),
);

export const selectNextPaymentCursor = createSelector(
    selectPaymentsStateForSelectedTrip,
    (s) => s?.nextCursor ?? null,
);

export const selectCanLoadMorePayments = createSelector(
    selectPaymentsStateForSelectedTrip,
    (s) => !!s && s.hasNextPage && s.list.status !== 'loading' && s.more.status !== 'loading',
);

export const selectPaymentsInitialLoading = createSelector(
    selectPaymentsStateForSelectedTrip,
    (s) => s === null || (s.ids.length === 0 && (s.list.status === 'loading' || s.list.status === 'idle')),
);
export const selectPaymentsMoreLoading = createSelector(
    selectPaymentsStateForSelectedTrip,
    (s) => s?.more.status === 'loading',
);
export const selectPaymentsMoreError = createSelector(
    selectPaymentsStateForSelectedTrip,
    (s) => s?.more.error ?? null,
);

export const selectPaymentsLoadingError = createSelector(
    selectPaymentsStateForSelectedTrip,
    (s) => (s && s.list.status === 'error' && s.ids.length === 0 ? s.list.error : null),
);

export const selectPaymentCreating = createSelector(paymentsFeature, (s) => s.create.status === 'loading');
export const selectPaymentCreatingError = createSelector(paymentsFeature, (s) => s.create.error);
export const selectPaymentUpdating = createSelector(paymentsFeature, (s) => s.update.status === 'loading');
export const selectPaymentUpdatingError = createSelector(paymentsFeature, (s) => s.update.error);

export const selectPaymentDeletingIds = createSelector(
    selectPaymentsStateForSelectedTrip,
    (s) => s?.deletingIds ?? [],
);
export const selectPaymentDeleteErrors = createSelector(
    selectPaymentsStateForSelectedTrip,
    (s) => s?.deleteErrors ?? [],
);
