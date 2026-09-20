import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CreateTripPayload, Trip } from '../trips.models';

export const LoadTripsActions = createActionGroup({
  source: 'Trips',
  events: {
    'Load Trips': emptyProps(),
    'Load Trips Success': props<{ trips: Trip[] }>(),
    'Load Trips Failure': props<{ error: string }>(),
  },
});

export const CreateTripActions = createActionGroup({
  source: 'Trips',
  events: {
    'Create Trip': props<{ payload: CreateTripPayload, image?: File }>(),
    'Create Trip Success': props<{ trip: Trip }>(),
    'Create Trip Failure': props<{ error: string }>()
  }
});