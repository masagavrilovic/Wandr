import { createActionGroup, props } from "@ngrx/store";
import { Settlement, SpendingByCategory } from "../summary.models";

export const LoadSettlementsActions = createActionGroup({
    source: 'Summary',
    events: {
        'Load Settlements': props<{ tripId: number }>(),
        'Load Settlements Success': props<{ settlement: Settlement }>(),
        'Load Settlements Failure': props<{ error: string }>(),
    }
});

export const LoadSpendingActions = createActionGroup({
    source: 'Summary',
    events: {
        'Load Spending': props<{ tripId: number }>(),
        'Load Spending Success': props<{ spending: SpendingByCategory }>(),
        'Load Spending Failure': props<{ error: string }>(),
    }
});