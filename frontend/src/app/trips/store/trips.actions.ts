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
    'Create Trip Failure': props<{ error: string }>(),
  }
});

export const JoinTripActions = createActionGroup({
  source: 'Trips',
  events: {
    'Join Trip': props<{ inviteCode: string }>(),
    'Join Trip Success': props<{ trip: Trip }>(),
    'Join Trip Failure': props<{ error: string }>(),
    'Reset Join Error': emptyProps(),
  }
});

export const LoadTripByIdActions = createActionGroup({
  source: 'Trips',
  events: {
    'Load Trip By Id': props<{ id: number }>(),
    'Load Trip By Id Success': props<{ trip: Trip }>(),
    'Load Trip By Id Failure': props<{ error: string }>(),
  }
})