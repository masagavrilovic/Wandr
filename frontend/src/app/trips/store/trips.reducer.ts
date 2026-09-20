import { createReducer, on, State } from "@ngrx/store";
import { Trip } from "../trips.models";
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { LoadTripsActions } from "./trips.actions";

export interface TripsState extends EntityState<Trip> {
    isLoading: boolean;
    loadingError: string | null;
};

export const initialState: TripsState = {
    ids: [],
    entities: {},
    isLoading: false,
    loadingError: null
};

export const adapter: EntityAdapter<Trip> = createEntityAdapter<Trip>();

export const tripsReducer = createReducer(
    initialState,
    on(LoadTripsActions.loadTrips, (state) => ({
        ...state,
        isLoading: true,
        loadingError: null
    })),
    on(LoadTripsActions.loadTripsSuccess, (state, { trips }) => 
        adapter.setAll(trips, {
            ...state,
            isLoading: false
        })
    ),
    on(LoadTripsActions.loadTripsFailure, (state, { error }) => ({
        ...state,
        isLoading: false,
        loadingError: error
    })),
);