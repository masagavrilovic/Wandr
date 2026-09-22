import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CreateTripPayload, Trip, UpdateTripPayload } from '../trips.models';

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
});

export const UpdateTripActions = createActionGroup({
  source: 'Trips',
  events: {
    'Update Trip': props<{ id: number, payload: UpdateTripPayload, image?: File}>(),
    'Update Trip Success': props<{ trip: Trip }>(),
    'Update Trip Failure': props<{ error: string }>(),
    'Clear Update Error': emptyProps(),
  }
});

export const DeleteTripActions = createActionGroup({
  source: 'Trips',
  events: {
    'Delete Trip': props<{ id: number }>(),
    'Delete Trip Success': props<{ id: number }>(),
    'Delete Trip Failure': props<{ error: string }>(),
    'Clear Delete Error': emptyProps(),
  }
});