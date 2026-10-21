import { createReducer, on } from "@ngrx/store";
import { Settlement } from "../summary.models";
import { LoadSettlementsActions } from "./summary.actions";

export interface SummaryState {
    data: Settlement | null;
    isLoading: boolean;
    error: string | null;
    tripId: number | null;
}

export const initialState: SummaryState = {
    data: null,
    isLoading: false,
    error: null,
    tripId: null,
};

export const summaryReducer = createReducer(
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