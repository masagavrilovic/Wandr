import { createReducer, on } from "@ngrx/store";
import { Settlement } from "../expenses.models";
import { LoadSettlementsActions } from "./expenses.actions";

export interface SettlementsState {
    data: Settlement | null;
    isLoading: boolean;
    error: string | null;
    tripId: number | null;
}

export const initialState: SettlementsState = {
    data: null,
    isLoading: false,
    error: null,
    tripId: null,
};

export const settlementsReducer = createReducer(
    initialState,
    on(LoadSettlementsActions.loadSettlements, (state, { tripId }) => ({
        ...state,
        isLoading: true,
        error: null,
        tripId,
    })),
    on(LoadSettlementsActions.loadSettlementsSuccess, (state, { settlement }) => ({
        ...state, isLoading: false, data: settlement,
    })),
    on(LoadSettlementsActions.loadSettlementsFailure, (state, { error }) => ({
        ...state, isLoading: false, error,
    })),
);