import { createFeatureSelector, createSelector } from "@ngrx/store";
import { paymentsAdapter, PaymentsState } from "./payments.reducer";

export const paymentsFeature = createFeatureSelector<PaymentsState>('payments');
const { selectAll, selectEntities, selectIds, selectTotal } = paymentsAdapter.getSelectors(paymentsFeature);
export const selectAllPayments = selectAll;
export const selectPaymentEntities = selectEntities;
export const selectPaymentIds = selectIds;
export const selectPaymentsTotal = selectTotal;

export const selectPaymentsLoading = createSelector(paymentsFeature, (state) => state.isLoading);
export const selectPaymentsLoadingError = createSelector(paymentsFeature, (state) => state.loadingError);

export const selectPaymentCreating = createSelector(paymentsFeature, (state) => state.isCreating);
export const selectPaymentCreatingError = createSelector(paymentsFeature, (state) => state.createError);

export const selectPaymentUpdating = createSelector(paymentsFeature, (state) => state.isUpdating);
export const selectPaymentUpdatingError = createSelector(paymentsFeature, (state) => state.updateError);

export const selectPaymentDeleteErrors = createSelector(paymentsFeature, (state) => state.deleteErrors);
