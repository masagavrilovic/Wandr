import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { Activity } from "../activities.models";
import { createReducer, on } from "@ngrx/store";
import { CreateActivityActions, DeleteActivityActions, LoadActivitiesActions, UpdateActivityActions } from "./activities.actions";
import { failedOp, initialOperation, loadingOp, OperationState, successOp } from "../../shared/store/operation-state";


export interface ActivityState extends EntityState<Activity> {
    tripId: number | null;
    load: OperationState;
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
    load: initialOperation,
    create: initialOperation,
    update: initialOperation,
    deletingIds: [],
    deleteErrors: [],
});

export const activityReducer = createReducer(
    initialState,
     on(LoadActivitiesActions.loadActivities, (state, { tripId }): ActivityState => {
        const base: ActivityState =
        state.tripId !== tripId
            ? adapter.removeAll({
                ...state,
                deletingIds: [],
                deleteErrors: [],
                create: initialOperation,
                update: initialOperation,
            })
            : state;
        return { ...base, tripId, load: loadingOp() };
    }),
    on(LoadActivitiesActions.loadActivitiesSuccess, (state, { activities, tripId }) =>
        tripId !== state.tripId
        ? state
        : adapter.setAll(activities, { ...state, load: successOp() })
    ),
    on(LoadActivitiesActions.loadActivitiesFailure, (state, { error }) => ({
        ...state,
        load: failedOp(error),
    })),
    on(CreateActivityActions.createActivity, (state) => ({
        ...state,
        create: loadingOp(),
    })),
    on(CreateActivityActions.createActivitySuccess, (state, { activity, tripId }) =>
        tripId !== state.tripId
        ? state
        : adapter.addOne(activity, { ...state, create: successOp() })
    ),
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
    on(UpdateActivityActions.updateActivitySuccess, (state, { activity, tripId }) =>
        tripId !== state.tripId
        ? state
        : adapter.updateOne(
            { id: activity.id, changes: activity },
            { ...state, update: successOp() }
            )
    ),
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