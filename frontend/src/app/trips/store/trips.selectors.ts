import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TripsState } from './trips.reducer';

export const selectTripsState = createFeatureSelector<TripsState>('trips');

export const selectAllTrips = createSelector(
  selectTripsState,
  (state) => state.trips
);

export const selectTripsLoading = createSelector(
  selectTripsState,
  (state) => state.isLoading
);

export const selectTripsError = createSelector(
  selectTripsState,
  (state) => state.error
);