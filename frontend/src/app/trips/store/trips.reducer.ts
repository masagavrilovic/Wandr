import { createReducer, on } from "@ngrx/store";
import { Trip } from "../trips.models";
import { loadTrips, loadTripsFailure, loadTripsSuccess } from "./trips.actions";

export interface TripsState {
    trips: Trip[];
    selectedTrip: Trip | null;
    isLoading: boolean;
    error: string | null;
}

export const initialState: TripsState = {
    trips: [],
    selectedTrip: null,
    isLoading: false,
    error: null
};

export const tripsReducer = createReducer(
    initialState,
    on(loadTrips, (state) => ({
        ...state,
        isLoading: true,
        error: null
    })),
    on(loadTripsSuccess, (state, { trips }) => ({
        ...state,
        isLoading: false,
        trips,
        error: null
    })),
    on(loadTripsFailure, (state, { error }) => ({
        ...state,
        isLoading: false,
        error
    }))
)