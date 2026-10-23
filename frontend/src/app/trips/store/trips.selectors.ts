import { createFeatureSelector, createSelector } from "@ngrx/store";
import { adapter, TripsState } from "./trips.reducer";
import { TripStatus } from "../trips.models";
import { UserSummary } from "../../user/user.models";
import { selectRouteParam } from "../../shared/store/router.selectors";

export const tripsFeature = createFeatureSelector<TripsState>('trips');

const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors(tripsFeature);
export const selectAllTrips = selectAll;
export const selectTripEntities = selectEntities;
export const selectTripIds = selectIds;
export const selectTripsTotal = selectTotal;

export const selectTripsLoading = createSelector(tripsFeature, (state) => state.isLoading);
export const selectTripsError = createSelector(tripsFeature, (state) => state.loadingError);
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

export const selectTripCreating = createSelector(tripsFeature, (state) => state.isCreating);
export const selectTripCreatingError = createSelector(tripsFeature, (state) => state.creatingError);

export const selectTripJoining = createSelector(tripsFeature, (state) => state.isJoining);
export const selectTripJoiningError = createSelector(tripsFeature, (state) => state.joiningError);

export const selectTripLoadingById = createSelector(tripsFeature, (state) => state.isLoadingById);
export const selectTripLoadingByIdError = createSelector(tripsFeature, (state) => state.loadingByIdError);
export const selectTripById = (id: number) => createSelector(selectTripEntities, (entities) => entities[id] ?? null);

export const selectTripUpdating = createSelector(tripsFeature, (state) => state.isUpdating);
export const selectUpdateTripError = createSelector(tripsFeature, (state) => state.updateError);

export const selectTripDeleting = createSelector(tripsFeature, (state) => state.isDeleting);
export const selectDeleteTripError = createSelector(tripsFeature, (state) => state.deleteError);

export const selectSelectedTripId = createSelector(
  selectRouteParam('id'),
  (raw): number | null => {
    if (raw === undefined || raw === null) return null;
    const id = Number(raw);
    return Number.isInteger(id) && id > 0 ? id : null;
  }
);

export const selectSelectedTrip = createSelector(
  selectTripEntities,
  selectSelectedTripId,
  (entities, id) => (id === null ? null : entities[id] ?? null)
);

export const selectSelectedTripBaseCurrency = createSelector(
  selectSelectedTrip,
  (trip): string | null => trip?.baseCurrency ?? null
);

export const selectSelectedTripMembers = createSelector(
  selectSelectedTrip,
  (trip): UserSummary[] => trip?.members ?? [] as UserSummary[]
);