import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { Activity, CreateActivityPayload } from "../activities.models";

export const LoadActivitiesActions = createActionGroup({
  source: 'Activities',
  events: {
    'Load Activities': props<{ tripId: number }>(),
    'Load Activities Success': props<{ activities: Activity[] }>(),
    'Load Activities Failure': props<{ error: string }>(),
  },
});

export const CreateActivityActions = createActionGroup({
  source: 'Activities',
  events: {
    'Create Activity': props<{ tripId: number, payload: CreateActivityPayload }>(),
    'Create Activity Success': props<{ activity: Activity, tripId: number }>(),
    'Create Activity Failure': props<{ error: string }>(),
    'Clear Create Error': emptyProps(),
  }
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