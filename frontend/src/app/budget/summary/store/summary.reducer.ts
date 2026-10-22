import { createReducer, on } from "@ngrx/store";
import { Settlement, SpendingByCategory } from "../summary.models";
import { LoadSettlementsActions, LoadSpendingActions } from "./summary.actions";

export interface SummaryState {
    data: Settlement | null;
    isLoading: boolean;
    error: string | null;
    tripId: number | null;

    spendingLoading: boolean;
    spendingError: string | null;
    spendingByCategory: SpendingByCategory | null;
}

export const initialState: SummaryState = {
    data: null,
    isLoading: false,
    error: null,
    tripId: null,

    spendingByCategory: null,
    spendingLoading: false,
    spendingError: null,
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
    on(LoadSpendingActions.loadSpending, (state, { tripId }) => ({
        ...state,
        spendingLoading: true,
        spendingError: null,
    })),
    on(LoadSpendingActions.loadSpendingSuccess, (state, { spending }) => ({
        ...state, 
        spendingLoading: false, 
        spendingByCategory: spending,
    })),
    on(LoadSpendingActions.loadSpendingFailure, (state, { error }) => ({
        ...state, 
        spendingLoading: false, 
        spendingError: error,
    })),
);