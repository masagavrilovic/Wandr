import { createReducer, on, State } from "@ngrx/store";
import { Trip } from "../trips.models";
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { CreateTripActions, LoadTripsActions } from "./trips.actions";

export interface TripsState extends EntityState<Trip> {
    isLoading: boolean;
    loadingError: string | null;

    isCreating: boolean;
    creatingError: string | null;
};

export const initialState: TripsState = {
    ids: [],
    entities: {},
    isLoading: false,
    loadingError: null,

    isCreating: false,
    creatingError: null
};

export const adapter: EntityAdapter<Trip> = createEntityAdapter<Trip>({
    selectId: (trip: Trip) => trip.id,
    sortComparer: (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
});

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
    on(CreateTripActions.createTrip, (state, { payload }) => ({
        ...state,
        isCreating: true,
        creatingError: null
    })),
    on(CreateTripActions.createTripSuccess, (state, { trip }) => 
        adapter.addOne(trip, {
            ...state,
            isCreating: false
        })
    ),
    on(CreateTripActions.createTripFailure, (state, { error }) => ({
        ...state,
        isCreating: false,
        creatingError: error
    })),
);