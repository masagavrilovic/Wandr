import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { Activity } from "../activities.models";
import { createReducer, on } from "@ngrx/store";
import { CreateActivityActions, DeleteActivityActions, LoadActivitiesActions, UpdateActivityActions } from "./activities.actions";
import { failedOp, initialOperation, loadingOp, OperationState, successOp } from "../../shared/store/operation-state";


export interface ActivityState extends EntityState<Activity> {
    tripId: number | null;
    date: string | null;
    nextCursor: number | null;
    hasNextPage: boolean;

    load: OperationState;
    more: OperationState;
    create: OperationState;
    update: OperationState;

    deletingIds: number[];
    deleteErrors: { id: number; message: string }[];
}

const compareOptional = (a?: string | null, b?: string | null): number => {
    if (a == null && b == null) return 0;
    if (a == null) return 1;
    if (b == null) return -1;
    return a.localeCompare(b);
};

export const adapter: EntityAdapter<Activity> = createEntityAdapter<Activity>({
    sortComparer: (a, b) =>
        compareOptional(a.date, b.date) || compareOptional(a.time, b.time) || a.id - b.id,
});

export const initialState: ActivityState = adapter.getInitialState({
    tripId: null,
    date: null,
    nextCursor: null,
    hasNextPage: false,

    load: initialOperation,
    more: initialOperation,
    create: initialOperation,
    update: initialOperation,

    deletingIds: [],
    deleteErrors: [],
});

function matchesSlice(state: ActivityState, tripId: number, date: string | null): boolean {
    return state.tripId === tripId && state.date === date;
}

export const activityReducer = createReducer(
    initialState,
    on(LoadActivitiesActions.loadActivities, (state, { tripId, date }): ActivityState => {
        const changed = !matchesSlice(state, tripId, date);
        const next: ActivityState = { 
            ...state, 
            tripId, 
            date, 
            load: loadingOp(), 
            more: initialOperation
        };
        return changed
            ? adapter.removeAll({
                ...next,
                nextCursor: null,
                hasNextPage: false,
                create: initialOperation,
                update: initialOperation,
                deletingIds: [],
                deleteErrors: [],
            })
            : next;
    }),
    on(LoadActivitiesActions.loadActivitiesSuccess, (state, { response, tripId, date }) =>
        !matchesSlice(state, tripId, date)
        ? state
        : adapter.setAll(response.data, {
            ...state,
            nextCursor: response.nextCursor,
            hasNextPage: response.hasNextPage,
            load: successOp(),
        }),
    ),
    on(LoadActivitiesActions.loadActivitiesFailure, (state, { error }) => ({
        ...state,
        load: failedOp(error),
    })),
    on(LoadActivitiesActions.loadMoreActivities, (state) => ({
        ...state,
        more: loadingOp()
    })),
    on(LoadActivitiesActions.loadMoreActivitiesSuccess, (state, { response, tripId, date}) =>
        !matchesSlice(state, tripId, date)
        ? state
        : adapter.upsertMany(response.data, {
            ...state,
            nextCursor: response.nextCursor,
            hasNextPage: response.hasNextPage,
            more: successOp(),
        })
    ),
    on(LoadActivitiesActions.loadMoreActivitiesFailure, (state, { error }) => ({
        ...state,
        more: failedOp(error)
    })),
    on(CreateActivityActions.createActivity, (state) => ({
        ...state,
        create: loadingOp(),
    })),
    on(CreateActivityActions.createActivitySuccess, (state, { activity, tripId }) => {
        const next: ActivityState = { ...state, create: successOp() };
        if (state.tripId !== tripId) return next;
        if (state.date && activity.date !== state.date) return next;
        return adapter.addOne(activity, next);
    }),
    on(CreateActivityActions.createActivityFailure, (state, { error }) => ({
        ...state,
        create: failedOp(error),
    })),
    on(CreateActivityActions.clearCreateError, (state) => ({
        ...state,
        create: initialOperation,
    })),
    on(UpdateActivityActions.updateActivity, (state) => ({
        ...state,
        update: loadingOp(),
    })),
    on(UpdateActivityActions.updateActivitySuccess, (state, { activity, tripId }) => {
        const next: ActivityState = { ...state, update: successOp() };
        if (state.tripId !== tripId) return next;
        return state.date && activity.date !== state.date
            ? adapter.removeOne(activity.id, next)
            : adapter.updateOne({ id: activity.id, changes: activity }, next);
    }),
    on(UpdateActivityActions.updateActivityFailure, (state, { error }) => ({
        ...state,
        update: failedOp(error),
    })),
    on(UpdateActivityActions.clearUpdateError, (state) => ({
        ...state,
        update: initialOperation,
    })),
    on(DeleteActivityActions.deleteActivity, (state, { id }) => ({
        ...state,
        deletingIds: [...state.deletingIds, id],
        deleteErrors: state.deleteErrors.filter((e) => e.id !== id),
    })),
    on(DeleteActivityActions.deleteActivitySuccess, (state, { id, tripId }) =>
        tripId !== state.tripId
        ? state
        : adapter.removeOne(id, {
            ...state,
            deletingIds: state.deletingIds.filter((x) => x !== id),
            })
    ),
    on(DeleteActivityActions.deleteActivityFailure, (state, { id, error }) => ({
        ...state,
        deletingIds: state.deletingIds.filter((x) => x !== id),
        deleteErrors: [...state.deleteErrors, { id, message: error }],
    })),
    on(DeleteActivityActions.clearDeleteError, (state, { id }) => ({
        ...state,
        deleteErrors: state.deleteErrors.filter((e) => e.id !== id),
    })),
);