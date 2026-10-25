import { createReducer, on } from "@ngrx/store";
import { Settlement, SpendingByCategory } from "../summary.models";
import { LoadSettlementsActions, LoadSpendingActions } from "./summary.actions";
import { failedOp, initialOperation, loadingOp, OperationState, successOp } from "../../../shared/store/operation-state";

export interface SummaryState {
    tripId: number | null;
    spendingByCategory: SpendingByCategory | null;
    settlements: Settlement | null;

    listSpending: OperationState;
    listSettlements: OperationState;
}

export const initialState: SummaryState = {
    tripId: null,
    spendingByCategory: null,
    settlements: null,

    listSettlements: initialOperation,
    listSpending: initialOperation,
};

const switchTrip = (state: SummaryState, tripId: number): SummaryState =>
    state.tripId === tripId
        ? state
        : { ...initialState, tripId };

export const summaryReducer = createReducer(
    initialState,
    on(LoadSettlementsActions.loadSettlements, (state, { tripId }) => {
        const base = switchTrip(state, tripId);
        return { ...base, listSettlements: loadingOp() };
    }),
    on(LoadSettlementsActions.loadSettlementsSuccess, (state, { settlement, tripId }) => {
        if (state.tripId !== tripId) return state;
        return { ...state, settlements: settlement, listSettlements: successOp() };
    }),
    on(LoadSettlementsActions.loadSettlementsFailure, (state, { error }) => ({
        ...state, listSettlements: failedOp(error),
    })),

    on(LoadSpendingActions.loadSpending, (state, { tripId }) => {
        const base = switchTrip(state, tripId);
        return { ...base, listSpending: loadingOp() };
    }),
    on(LoadSpendingActions.loadSpendingSuccess, (state, { spending, tripId }) => {
        if (state.tripId !== tripId) return state;
        return { ...state, spendingByCategory: spending, listSpending: successOp() };
    }),
    on(LoadSpendingActions.loadSpendingFailure, (state, { error }) => ({
        ...state, listSpending: failedOp(error),
    })),
);