import { createFeatureSelector, createSelector } from "@ngrx/store";
import { adapter, initialState, PackingListState } from "./packing-list.reducer";
import { PackingList } from "../packing-list.models";
import { selectSelectedTripId } from "../../trips/store/trips.selectors";

export const packingListFeature = createFeatureSelector<PackingListState>('packingList');

export const selectPackingSliceTripId = createSelector(packingListFeature, (state) => state.tripId);
export const selectPackingLoadStatus = createSelector(packingListFeature, (state) => state.load.status);

export const selectPackingStateForSelectedTrip = createSelector(
  packingListFeature,
  selectSelectedTripId,
  (state, tripId): PackingListState =>
    tripId !== null && state.tripId === tripId ? state : initialState
);

const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors(selectPackingStateForSelectedTrip);
export const selectAllPackingItems = selectAll;
export const selectPackingItemEntities = selectEntities;
export const selectPackingItemIds = selectIds;
export const selectPackingItemsTotal = selectTotal;

export const selectPackingItemsLoading = createSelector(selectPackingStateForSelectedTrip, (state) => state.load.status === 'loading');
export const selectPackingItemsLoadingError = createSelector(selectPackingStateForSelectedTrip, (state) => state.load.error);

export const selectPackingItemsInitialLoading = createSelector(
  selectPackingStateForSelectedTrip,
  selectPackingItemsTotal,
  (state, total) =>
    total === 0 &&
    (state.tripId === null || state.load.status === 'loading' || state.load.status === 'idle')
);

export const selectPersonalPackingItems = createSelector(selectAllPackingItems, (items) => items.filter((item) => item.listType === PackingList.PERSONAL));
export const selectSharedPackingItems = createSelector(selectAllPackingItems, (items) => items.filter((item) => item.listType === PackingList.SHARED));

export const selectPersonalPackingItemsGroupedByCategory = createSelector(
  selectPersonalPackingItems,
  (items) =>
    Array.from(
      Map.groupBy(items, (item) => item.category),
      ([category, items]) => ({ category, items })
    )
);

export const selectSharedPackingItemsGroupedByCategory = createSelector(
  selectSharedPackingItems,
  (items) =>
    Array.from(
      Map.groupBy(items, (item) => item.category),
      ([category, items]) => ({ category, items })
    )
);

export const selectPersonalPackingProgress = createSelector(
  selectPersonalPackingItems,
  (items) => ({
    packed: items.filter((item) => item.assignedTo !== null).length,
    total: items.length,
  })
);

export const selectSharedPackingProgress = createSelector(
  selectSharedPackingItems,
  (items) => ({
    packed: items.filter((item) => item.assignedTo !== null).length,
    total: items.length,
  })
);

export const selectCreatingPackingItem = createSelector(selectPackingStateForSelectedTrip, (state) => state.create.status === 'loading');
export const selectCreatePackingItemError = createSelector(selectPackingStateForSelectedTrip, (state) => state.create.error);

export const selectUpdatingPackingItem = createSelector(selectPackingStateForSelectedTrip, (state) => state.update.status === 'loading');
export const selectUpdatePackingItemError = createSelector(selectPackingStateForSelectedTrip, (state) => state.update.error);

export const selectPackingItemDeletingIds = createSelector(selectPackingStateForSelectedTrip, (state) => state.deletingIds);
export const selectPackingItemDeleteErrors = createSelector(selectPackingStateForSelectedTrip, (state) => state.deleteErrors);

export const selectTogglingIds = createSelector(selectPackingStateForSelectedTrip, (state) => state.togglingIds);
export const selectPackingToggleErrors = createSelector(selectPackingStateForSelectedTrip, (state) => state.toggleErrors);