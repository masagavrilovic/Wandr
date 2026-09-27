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

export const selectCreatingPackingItem = createSelector(packingListFeature, (state) => state.isCreating);
export const selectCreatePackingItemError = createSelector(packingListFeature, (state) => state.createError);

export const selectUpdatingPackingItem = createSelector(packingListFeature, (state) => state.isUpdating);
export const selectUpdatePackingItemError = createSelector(packingListFeature, (state) => state.updateError);

export const selectPackingItemDeletingIds = createSelector(packingListFeature, (state) => state.deletingIds);
export const selectPackingItemDeleteErrors = createSelector(packingListFeature, (state) => state.deleteErrors);