import { createFeatureSelector, createSelector } from '@ngrx/store';
import { tripsAdapter, TripsState } from './trips.reducer';

export const selectTripsState = createFeatureSelector<TripsState>('trips');

const { selectAll, selectEntities, selectIds, selectTotal } = tripsAdapter.getSelectors(selectTripsState);

export const selectAllTrips = selectAll;
export const selectTripEntities = selectEntities;
export const selectTripIds = selectIds;
export const selectTripsTotal = selectTotal;

export const selectTripsLoading = createSelector(
    selectTripsState,
    (state) => state.isLoading
);

export const selectTripsError = createSelector(
    selectTripsState,
    (state) => state.error
);