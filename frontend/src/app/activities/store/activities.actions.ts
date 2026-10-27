import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { Activity, CreateActivityPayload, UpdateActivityPayload } from "../activities.models";
import { PaginatedResponse } from "../../shared/pagination.models";

export const ItineraryTabActions = createActionGroup({
  source: 'Itinerary Tab',
  events: {
    'Opened': emptyProps(),
  },
});

export const ActivityFilterActions = createActionGroup({
  source: 'Activity Filter',
  events: {
    'Set Date': props<{ date: string | null }>(),
  },
});

export const LoadActivitiesActions = createActionGroup({
  source: 'Activities',
  events: {
    'Load Activities': props<{ tripId: number, date: string | null }>(),
    'Load Activities Success': props<{ response: PaginatedResponse<Activity>, tripId: number, date: string | null }>(),
    'Load Activities Failure': props<{ error: string }>(),

    'Load More Activities': emptyProps(),
    'Load More Activities Success': props<{ response: PaginatedResponse<Activity>, tripId: number, date: string | null }>(),
    'Load More Activities Failure': props<{ error: string }>(),
  },
});

export const CreateActivityActions = createActionGroup({
  source: 'Activities',
  events: {
    'Create Activity': props<{ payload: CreateActivityPayload }>(),
    'Create Activity Success': props<{ activity: Activity, tripId: number }>(),
    'Create Activity Failure': props<{ error: string }>(),
    'Clear Create Error': emptyProps(),
  }
});

export const UpdateActivityActions = createActionGroup({
  source: 'Activities',
  events: {
    'Update Activity': props<{ id: number, payload: UpdateActivityPayload }>(),
    'Update Activity Success': props<{ activity: Activity, tripId: number}>(),
    'Update Activity Failure': props<{ error: string}>(),
    'Clear Update Error': emptyProps(),
  }
});

export const DeleteActivityActions = createActionGroup({
    source: 'Activities',
    events: {
        'Delete Activity': props<{ id: number }>(),
        'Delete Activity Success': props<{ id: number, tripId: number }>(),
        'Delete Activity Failure': props<{ id: number, error: string }>(),
        'Clear Delete Error': props<{ id: number }>(),
    }
});