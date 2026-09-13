import { createAction, props } from "@ngrx/store";
import { Trip } from "../trips.models";


export const loadTrips = createAction('[Trips] Load Trips');
export const loadTripsSuccess = createAction('[Trips] Load Trips Success', props<{ trips: Trip[] }>());
export const loadTripsFailure = createAction('[Trips] Load Trips Failure', props<{ error: string }>());