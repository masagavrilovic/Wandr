import { createReducer, on } from "@ngrx/store";
import { Trip } from "../trips.models";
import { loadTrips, loadTripsFailure, loadTripsSuccess } from "./trips.actions";
import { createEntityAdapter, EntityState } from "@ngrx/entity";

export interface TripsState extends EntityState<Trip> {
    isLoading: boolean;
    error: string | null;
}

export const tripsAdapter = createEntityAdapter<Trip>({
    selectId: (trip) => trip.id,
    sortComparer: (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
})

export const initialState: TripsState = tripsAdapter.getInitialState({
    isLoading: false,
    error: null
});

export const tripsReducer = createReducer(
    initialState,
    on(loadTrips, (state) => ({
        ...state,
        isLoading: true,
        error: null
    })),
    on(loadTripsSuccess, (state, { trips }) => 
        tripsAdapter.setAll(trips, {
            ...state,
            isLoading: false,
            error: null
        })
    ),
    on(loadTripsFailure, (state, { error }) => ({
        ...state,
        isLoading: false,
        error
    }))
)