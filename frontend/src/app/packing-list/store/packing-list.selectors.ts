import { createFeatureSelector, createSelector } from "@ngrx/store";
import { adapter, PackingListState } from "./packing-list.reducer";
import { PackingList } from "../packing-list.models";


export const packingListFeature = createFeatureSelector<PackingListState>('packingList');
const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors(packingListFeature);
export const selectAllPackingItems = selectAll;
export const selectPackingItemEntities = selectEntities;
export const selectPackingItemIds = selectIds;
export const selectPackingItemsTotal = selectTotal;

export const selectPackingItemsLoading = createSelector(packingListFeature, (state) => state.isLoading);
export const selectPackingItemsLoadingError = createSelector(packingListFeature, (state) => state.loadingError);

export const selectPersonalPackingItems = createSelector(
  selectAllPackingItems,
  (items) => items.filter((item) => item.listType === PackingList.PERSONAL)
);

export const selectSharedPackingItems = createSelector(
  selectAllPackingItems,
  (items) => items.filter((item) => item.listType === PackingList.SHARED)
);