import { createFeatureSelector, createSelector } from "@ngrx/store";
import { adapter, TripsState } from "./trips.reducer";
import { Trip, TripStatus } from "../trips.models";
import { UserSummary } from "../../user/user.models";
import { selectRouteParam } from "../../shared/store/router.selectors";

export const tripsFeature = createFeatureSelector<TripsState>('trips');

const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors(tripsFeature);
export const selectAllTrips = selectAll;
export const selectTripEntities = selectEntities;
export const selectTripIds = selectIds;
export const selectTripsTotal = selectTotal;

export const selectTripsLoading = createSelector(tripsFeature, (state) => state.list.status === 'loading');
export const selectTripsError = createSelector(tripsFeature, (state) => state.list.error);
export const selectTripsInitialLoading = createSelector(
  selectTripsLoading,
  selectTripsTotal,
  (loading, total) => loading && total === 0
);

export const selectActiveTrips = createSelector(
  selectAllTrips,
  (trips) => trips.filter(trip => trip.status === TripStatus.PLANNING || trip.status === TripStatus.ONGOING)
);

export const selectArchivedTrips = createSelector(
  selectAllTrips,
  (trips) => trips.filter(trip => trip.status === TripStatus.CANCELED || trip.status === TripStatus.FINISHED)
);

export const selectHeroTrip = createSelector(
  selectActiveTrips,
  (trips) => {
    const ongoing = trips.filter(t => t.status === TripStatus.ONGOING);
    if (ongoing.length > 0) return ongoing[0];
    const planning = trips.filter(t => t.status === TripStatus.PLANNING);
    return planning[0] ?? null;
  }
);

export const selectActiveTripsWithoutHero = createSelector(
  selectActiveTrips,
  selectHeroTrip,
  (trips, hero) => (hero ? trips.filter(t => t.id !== hero.id) : trips)
);

export const selectTripCreating = createSelector(tripsFeature, (state) => state.create.status === 'loading');
export const selectTripCreatingError = createSelector(tripsFeature, (state) => state.create.error);

export const selectTripJoining = createSelector(tripsFeature, (state) => state.join.status === 'loading');
export const selectTripJoiningError = createSelector(tripsFeature, (state) => state.join.error);

export const selectDetailTrip = createSelector(tripsFeature, (state) => state.detailTrip);
export const selectTripLoadingByIdError = createSelector(tripsFeature, (state) => state.detail.error);
export const selectTripDetailPending = createSelector(
  tripsFeature,
  (state) => state.detail.status === 'idle' || state.detail.status === 'loading'
);
export const selectTripNotFound = createSelector(tripsFeature, (state) => state.detailNotFound);
export const selectTripUpdating = createSelector(tripsFeature, (state) => state.update.status === 'loading');
export const selectUpdateTripError = createSelector(tripsFeature, (state) => state.update.error);

export const selectTripDeleting = createSelector(tripsFeature, (state) => state.remove.status === 'loading');
export const selectDeleteTripError = createSelector(tripsFeature, (state) => state.remove.error);

export const selectSelectedTripId = createSelector(
  selectRouteParam('id'),
  (raw): number | null => {
    if (raw === undefined || raw === null) return null;
    const id = Number(raw);
    return Number.isInteger(id) && id > 0 ? id : null;
  }
);

export const selectSelectedTrip = createSelector(
  selectDetailTrip,
  selectSelectedTripId,
  (trip, id): Trip | null => (trip !== null && id !== null && trip.id === id ? trip : null)
);

export const selectSelectedTripBaseCurrency = createSelector(
  selectSelectedTrip,
  (trip): string | null => trip?.baseCurrency ?? null
);

export const selectSelectedTripMembers = createSelector(
  selectSelectedTrip,
  (trip): UserSummary[] => trip?.members ?? [] as UserSummary[]
);