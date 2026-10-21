import { createActionGroup, props } from "@ngrx/store";
import { Settlement } from "../summary.models";

export const LoadSettlementsActions = createActionGroup({
    source: 'Summary',
    events: {
        'Load Settlements': props<{ tripId: number }>(),
        'Load Settlements Success': props<{ settlement: Settlement }>(),
        'Load Settlements Failure': props<{ error: string }>(),
    }
});