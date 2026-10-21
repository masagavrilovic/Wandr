import { createFeatureSelector, createSelector } from "@ngrx/store";
import { SummaryState } from "./summary.reducer";

export const summaryFeature = createFeatureSelector<SummaryState>('summary');

export const selectSettlement = createSelector(summaryFeature, (s) => s.data);
export const selectSettlementBalances = createSelector(summaryFeature, (s) => s.data?.balances ?? []);
export const selectSettlementTransactions = createSelector(summaryFeature, (s) => s.data?.transactions ?? []);
export const selectSettlementsLoading = createSelector(summaryFeature, (s) => s.isLoading);
export const selectSettlementsError = createSelector(summaryFeature, (s) => s.error);