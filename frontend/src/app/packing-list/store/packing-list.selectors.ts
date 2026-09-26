import { createFeatureSelector, createSelector } from "@ngrx/store";
import { adapter, PackingListState } from "./packing-list.reducer";
import { PackingCategory, PackingList, PackingListItem } from "../packing-list.models";


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

export const selectCreatingPackingItem = createSelector(packingListFeature, (state) => state.isCreating);
export const selectCreatePackingItemError = createSelector(packingListFeature, (state) => state.createError);