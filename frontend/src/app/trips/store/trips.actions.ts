import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Trip } from '../trips.models';

export const LoadTripsActions = createActionGroup({
  source: 'Trips Page',
  events: {
    'Load Trips': emptyProps(),
    'Load Trips Success': props<{ trips: Trip[] }>(),
    'Load Trips Failure': props<{ error: string }>(),
  },
});