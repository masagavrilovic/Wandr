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