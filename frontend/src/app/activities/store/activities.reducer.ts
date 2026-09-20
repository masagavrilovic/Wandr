import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { Activity } from "../activities.models";
import { createReducer, on } from "@ngrx/store";
import { DeleteActivityActions, LoadActivitiesActions } from "./activites.actions";


export interface ActivityState extends EntityState<Activity> {
    isLoading: boolean;
    loadingError: string | null;
    tripId: number | null;

    deletingIds: number[];
    deleteErrors: { id: number; message: string }[];
}

export const initialState: ActivityState = {
    ids: [],
    entities: {},
    isLoading: false,
    loadingError: null,
    tripId: null,

    deletingIds: [],
    deleteErrors: [],
}

const compareOptional = (a?: string | null, b?: string | null): number => {
    if (a == null && b == null) return 0;
    if (a == null) return 1;
    if (b == null) return -1;
    return a.localeCompare(b);
};

export const adapter: EntityAdapter<Activity> = createEntityAdapter<Activity>({
    sortComparer: (a, b) =>
        compareOptional(a.date, b.date) || compareOptional(a.time, b.time),
});

export const activityReducer = createReducer(
    initialState,
    on(LoadActivitiesActions.loadActivities, (state, { tripId }) => ({
        ...state,
        isLoading: true,
        loadingError: null,
        tripId,
        deletingIds: [],
        deleteErrors: [],
    })),
    on(LoadActivitiesActions.loadActivitiesSuccess, (state, { activities }) =>
        adapter.setAll(activities, {
            ...state,
            isLoading: false
        })
    ),
    on(LoadActivitiesActions.loadActivitiesFailure, (state, { error }) => ({
        ...state,
        isLoading: false,
        loadingError: error
    })),
    on(DeleteActivityActions.deleteActivity, (state, { id }) => ({
        ...state,
        deletingIds: [...state.deletingIds, id],
        deleteErrors: state.deleteErrors.filter(e => e.id !== id)
    })),
    on(DeleteActivityActions.deleteActivitySuccess, (state, { id }) => 
        adapter.removeOne(id, {
            ...state,
            deletingIds: state.deletingIds.filter(x => x !== id)
        })
    ),
    on(DeleteActivityActions.deleteActivityFailure, (state, { id, error }) => ({
        ...state,
        deletingIds: state.deletingIds.filter(x => x !== id),
        deleteErrors: [...state.deleteErrors, { id, message: error }],
    })),
    on(DeleteActivityActions.clearDeleteError, (state, { id }) => ({
        ...state,
        deleteErrors: state.deleteErrors.filter(e => e.id !== id),
    })),
);