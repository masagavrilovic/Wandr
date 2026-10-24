import { createFeatureSelector, createSelector } from "@ngrx/store";
import { adapter, ExpensesState } from "./expenses.reducer";
import { selectSelectedTripId } from "../../../trips/store/trips.selectors";

export const expensesFeature = createFeatureSelector<ExpensesState>('expenses');
const entitySelectors = adapter.getSelectors();

export const selectExpenseSliceTripId = createSelector(expensesFeature, (s) => s.tripId);
export const selectExpenseListStatus = createSelector(expensesFeature, (s) => s.list.status);
export const selectExpenseFetchContext = createSelector(expensesFeature, (s) => ({
    tripId: s.tripId,
    category: s.category,
    nextCursor: s.nextCursor,
}));

export const selectExpenseCreating = createSelector(expensesFeature, (s) => s.create.status === 'loading');
export const selectExpenseCreatingError = createSelector(expensesFeature, (s) => s.create.error);
export const selectExpenseUpdating = createSelector(expensesFeature, (s) => s.update.status === 'loading');
export const selectExpenseUpdatingError = createSelector(expensesFeature, (s) => s.update.error);

export const selectExpensesStateForSelectedTrip = createSelector(
    expensesFeature,
    selectSelectedTripId,
    (state, tripId) => state.tripId !== null && state.tripId === tripId ? state : null
);

export const selectAllExpenses = createSelector(selectExpensesStateForSelectedTrip, (s) => (s ? entitySelectors.selectAll(s) : []));
export const selectExpenseEntities = createSelector(selectExpensesStateForSelectedTrip, (s) => (s ? s.entities : {}));
export const selectExpenseIds = createSelector(selectExpensesStateForSelectedTrip, (s) => (s ? s.ids : []));
export const selectExpensesTotal = createSelector(selectExpensesStateForSelectedTrip, (s) => (s ? s.ids.length : 0));

export const selectExpensesLoadingError = createSelector(selectExpensesStateForSelectedTrip, (s) => s?.list.error ?? null);
export const selectExpensesMoreError = createSelector(selectExpensesStateForSelectedTrip, (s) => s?.more.error ?? null);
export const selectExpenseDeleteErrors = createSelector(selectExpensesStateForSelectedTrip, (s) => s?.deleteErrors ?? []);

export const selectExpenseNextCursor = createSelector(selectExpensesStateForSelectedTrip, (s) => s?.nextCursor ?? null);
export const selectExpenseHasNextPage = createSelector(selectExpensesStateForSelectedTrip, (s) => s?.hasNextPage ?? false);

export const selectExpenseCategoryFilter = createSelector(selectExpensesStateForSelectedTrip,(s) => s?.category ?? null);

export const selectCanLoadMoreExpenses = createSelector(
    selectExpensesStateForSelectedTrip,
    (s) => !!s && s.hasNextPage && s.list.status !== 'loading' && s.more.status !== 'loading'
);
export const selectExpensesInitialLoading = createSelector(
    selectExpensesStateForSelectedTrip,
    selectAllExpenses,
    (s, all) => s === null || (s.list.status === 'loading' && all.length === 0)
);
export const selectExpensesMoreLoading = createSelector(selectExpensesStateForSelectedTrip, (s) => !!s && s.more.status === 'loading');
export const selectShowExpenseTracker = createSelector(
    selectAllExpenses,
    selectExpenseCategoryFilter,
    (all, filter) => all.length > 0 || filter !== null
);
