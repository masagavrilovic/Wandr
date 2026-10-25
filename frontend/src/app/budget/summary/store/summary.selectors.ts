import { createFeatureSelector, createSelector } from "@ngrx/store";
import { SummaryState } from "./summary.reducer";
import { selectSelectedTripId } from "../../../trips/store/trips.selectors";

export const summaryFeature = createFeatureSelector<SummaryState>('summary');

export const selectSummarySliceTripId = createSelector(summaryFeature, (s) => s.tripId);
const selectMatchesSelectedTrip = createSelector(summaryFeature, selectSelectedTripId, (s, id) => id !== null && s.tripId === id);

export const selectSettlementsSliceTripId = selectSummarySliceTripId;
export const selectSettlementsStatus = createSelector(summaryFeature, (s) => s.listSettlements.status);

export const selectSettlement = createSelector(
    summaryFeature, selectMatchesSelectedTrip,
    (s, matches) => (matches ? s.settlements : null),
);
export const selectSettlementBalances = createSelector(selectSettlement, (d) => d?.balances ?? []);
export const selectSettlementTransactions = createSelector(selectSettlement, (d) => d?.transactions ?? []);

export const selectSettlementsLoading = createSelector(
    summaryFeature, 
    selectMatchesSelectedTrip,
    (s, matches) => !(matches && (s.settlements !== null || s.listSettlements.status === 'error')),
);

export const selectSettlementsError = createSelector(
    summaryFeature, 
    selectMatchesSelectedTrip,
    (s, matches) => (matches && s.settlements === null ? s.listSettlements.error : null),
);

export const selectSpendingSliceTripId = selectSummarySliceTripId;
export const selectSpendingStatus = createSelector(summaryFeature, (s) => s.listSpending.status);

export const selectSpendingByCategory = createSelector(
    summaryFeature, selectMatchesSelectedTrip,
    (s, matches) => (matches ? s.spendingByCategory : null),
);
export const selectSpendingLoading = createSelector(
    summaryFeature, selectMatchesSelectedTrip,
    (s, matches) => !(matches && (s.spendingByCategory !== null || s.listSpending.status === 'error')),
);
export const selectSpendingError = createSelector(
    summaryFeature, selectMatchesSelectedTrip,
    (s, matches) => (matches && s.spendingByCategory === null ? s.listSpending.error : null),
);