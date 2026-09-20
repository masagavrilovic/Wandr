import { createActionGroup, props } from "@ngrx/store";
import { Activity } from "../activities.models";

export const LoadActivitiesActions = createActionGroup({
  source: 'Activities',
  events: {
    'Load Activities': props<{ tripId: number }>(),
    'Load Activities Success': props<{ activities: Activity[] }>(),
    'Load Activities Failure': props<{ error: string }>(),
  },
});

export const DeleteActivityActions = createActionGroup({
    source: 'Activities',
    events: {
        'Delete Activity': props<{ tripId: number, id: number }>(),
        'Delete Activity Success': props<{ id: number}>(),
        'Delete Activity Failure': props<{ id: number, error: string }>(),
        'Clear Delete Error': props<{ id: number }>(),
    }
});