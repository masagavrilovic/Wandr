import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ActivityState, adapter } from './activities.reducer';
import { ActivityGroup } from '../activities.models';
import { selectSelectedTripId } from '../../trips/store/trips.selectors';

export const activityFeature = createFeatureSelector<ActivityState>('activities');

export const selectActivitiesSliceTripId = createSelector(activityFeature, (s) => s.tripId);
export const selectActivitiesLoadStatus = createSelector(activityFeature, (s) => s.load.status);

export const selectActivitiesStateForSelectedTrip = createSelector(
  activityFeature,
  selectSelectedTripId,
  (state, tripId): ActivityState | null =>
    tripId !== null && state.tripId === tripId ? state : null,
);

const { selectAll, selectEntities, selectIds } = adapter.getSelectors(activityFeature);

export const selectAllActivities = createSelector(
  selectActivitiesStateForSelectedTrip,
  selectAll,
  (guarded, all) => (guarded ? all : []),
);
export const selectActivityEntities = createSelector(
  selectActivitiesStateForSelectedTrip,
  selectEntities,
  (guarded, entities) => (guarded ? entities : {}),
);
export const selectActivityIds = createSelector(
  selectActivitiesStateForSelectedTrip,
  selectIds,
  (guarded, ids) => (guarded ? ids : []),
);
export const selectActivitiesTotal = createSelector(selectAllActivities, (all) => all.length);

export const selectActivityById = (id: number) => createSelector(selectActivityEntities, (entities) => entities[id]);

export const selectActivitiesInitialLoading = createSelector(
  selectActivitiesStateForSelectedTrip,
  (guarded) => guarded === null || (guarded.load.status === 'loading' && guarded.ids.length === 0),
);

export const selectActivitiesLoadingError = createSelector(
  selectActivitiesStateForSelectedTrip,
  (guarded) => (guarded && guarded.ids.length === 0 ? guarded.load.error : null),
);

export const selectActivitiesGroupedByDay = createSelector(
  selectAllActivities,
  (activities): ActivityGroup[] =>
    Array.from(
      Map.groupBy(activities, (a) => a.date?.slice(0, 10) ?? null),
      ([date, activities]) => ({ date, activities }),
    ),
);

export const selectCreatingActivity = createSelector(activityFeature, (s) => s.create.status === 'loading');
export const selectCreateActivityError = createSelector(activityFeature, (s) => s.create.error);

export const selectUpdatingActivity = createSelector(activityFeature, (s) => s.update.status === 'loading');
export const selectUpdateActivityError = createSelector(activityFeature, (s) => s.update.error);

export const selectDeletingIds = createSelector(
  selectActivitiesStateForSelectedTrip,
  (guarded) => guarded?.deletingIds ?? [],
);
export const selectDeleteErrors = createSelector(
  selectActivitiesStateForSelectedTrip,
  (guarded) => guarded?.deleteErrors ?? [],
);