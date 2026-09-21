import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ActivityState, adapter } from "./activities.reducer";
import { ActivityGroup } from "../activities.models";

export const activityFeature = createFeatureSelector<ActivityState>('activities');

const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors(activityFeature);
export const selectAllActivities = selectAll;
export const selectActivityEntities = selectEntities;
export const selectActivityIds = selectIds;
export const selectActivitiesTotal = selectTotal;

export const selectActivitesLoading = createSelector(activityFeature, (state) => state.isLoading);
export const selectActivitiesLoadingError = createSelector(activityFeature, (state) => state.loadingError);

export const selectActivitiesGroupedByDay = createSelector(
  selectAllActivities,
  (activities): ActivityGroup[] =>
    Array.from(
      Map.groupBy(activities, a => a.date?.slice(0, 10) ?? null),
      ([date, activities]) => ({ date, activities })
    )
);

export const selectCreatingActivity = createSelector(activityFeature, (state) => state.isCreating);
export const selectCreateActivityError = createSelector(activityFeature, (state) => state.createError);

export const selectDeletingIds = createSelector(activityFeature, (state) => state.deletingIds);
export const selectDeleteErrors = createSelector(activityFeature, (state) => state.deleteErrors);