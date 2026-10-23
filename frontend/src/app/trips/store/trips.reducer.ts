import { createReducer, on } from "@ngrx/store";
import { toTripSummary, Trip, TripSummary } from "../trips.models";
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { CreateTripActions, DeleteTripActions, JoinTripActions, LoadTripByIdActions, LoadTripsActions, UpdateTripActions } from "./trips.actions";
import { failedOp, initialOperation, loadingOp, OperationState, successOp } from "../../shared/store/operation-state";

export interface TripsState extends EntityState<Trip> {
    list: OperationState;
    create: OperationState;
    join: OperationState;
    detail: OperationState;
    update: OperationState;
    remove: OperationState;

    detailTrip: Trip | null;
    detailNotFound: boolean;
};

export const initialState: TripsState = {
    ids: [],
    entities: {},
    list: initialOperation,
    create: initialOperation,
    join: initialOperation,
    detail: initialOperation,
    update: initialOperation,
    remove: initialOperation,

    detailTrip: null,
    detailNotFound: false,
};

export const adapter: EntityAdapter<TripSummary> = createEntityAdapter<TripSummary>({
    selectId: (trip: TripSummary) => trip.id,
    sortComparer: (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
});

export const tripsReducer = createReducer(
    initialState,
    on(LoadTripsActions.loadTrips, (state) => ({
        ...state,
        list: loadingOp()
    })),
    on(LoadTripsActions.loadTripsSuccess, (state, { trips }) => 
        adapter.setAll(trips, {
            ...state,
            list: successOp()
        })
    ),
    on(LoadTripsActions.loadTripsFailure, (state, { error }) => ({
        ...state,
        list: failedOp(error)
    })),
    on(CreateTripActions.createTrip, (state) => ({
        ...state,
        create: loadingOp()
    })),
    on(CreateTripActions.createTripSuccess, (state, { trip }) => 
        adapter.upsertOne(toTripSummary(trip), {
            ...state,
            create: successOp(),
            detailTrip: trip
        })
    ),
    on(CreateTripActions.createTripFailure, (state, { error }) => ({
        ...state,
        create: failedOp(error)
    })),
    on(CreateTripActions.clearCreateError, (state) => ({
        ...state,
        create: initialOperation
    })),
    on(JoinTripActions.joinTrip, (state) => ({
        ...state,
        join: loadingOp()
    })),
    on(JoinTripActions.joinTripSuccess, (state, { trip }) =>
        adapter.upsertOne(toTripSummary(trip), {
            ...state,
            join: successOp(),
            detailTrip: trip
        })
    ),
    on(JoinTripActions.joinTripFailure, (state, { error }) => ({
        ...state,
        join: failedOp(error)
    })),
    on(JoinTripActions.resetJoinError, (state) => ({ 
        ...state, 
        join: initialOperation
    })),
    on(LoadTripByIdActions.loadTripById, (state, { id }) => ({
        ...state,
        detail: loadingOp(),
        detailNotFound: false,
        detailTrip: state.detailTrip?.id === id ? state.detailTrip : null
    })),
    on(LoadTripByIdActions.loadTripByIdSuccess, (state, { trip }) =>
        adapter.upsertOne(toTripSummary(trip), {
            ...state,
            detail: successOp(),
            detailNotFound: false,
            detailTrip: trip
        })
    ),
    on(LoadTripByIdActions.loadTripByIdFailure, (state, { error }) => ({
        ...state,
        detail: failedOp(error),
        detailNotFound: true,
        detailTrip: null
    })),
    on(UpdateTripActions.updateTrip, (state) => ({
        ...state,
        update: loadingOp()
    })),
    on(UpdateTripActions.updateTripSuccess, (state, { trip }) => 
        adapter.upsertOne(toTripSummary(trip), {
            ...state,
            update: successOp(),
            detailTrip: trip
        })
    ),
    on(UpdateTripActions.updateTripFailure, (state, { error }) => ({
        ...state,
        update: failedOp(error)
    })),
    on(UpdateTripActions.clearUpdateError, (state) => ({
        ...state,
        update: initialOperation
    })),
    on(DeleteTripActions.deleteTrip, (state) => ({
        ...state,
        remove: loadingOp()
    })),
    on(DeleteTripActions.deleteTripSuccess, (state, { id }) =>
        adapter.removeOne(id, {
            ...state,
            remove: successOp(),
            detailTrip: state.detailTrip?.id === id ? null : state.detailTrip
        })
    ),
    on(DeleteTripActions.deleteTripFailure, (state, { error }) => ({
        ...state,
        remove: failedOp(error)
    })),
    on(DeleteTripActions.clearDeleteError, (state) => ({
        ...state,
        remove: initialOperation
    }))
);