import { createFeatureSelector, createSelector } from "@ngrx/store";
import { SettlementsState } from "./settlements.reducer";

export const settlementsFeature = createFeatureSelector<SettlementsState>('settlements');

export const selectSettlement = createSelector(settlementsFeature, (s) => s.data);
export const selectSettlementBalances = createSelector(settlementsFeature, (s) => s.data?.balances ?? []);
export const selectSettlementTransactions = createSelector(settlementsFeature, (s) => s.data?.transactions ?? []);
export const selectSettlementsLoading = createSelector(settlementsFeature, (s) => s.isLoading);
export const selectSettlementsError = createSelector(settlementsFeature, (s) => s.error);