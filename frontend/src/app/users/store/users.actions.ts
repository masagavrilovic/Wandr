import { createAction, props } from '@ngrx/store';
import { User } from '../users.models';

export const loadCurrentUser = createAction('[Users] Load Current User');
export const loadCurrentUserSuccess = createAction('[Users] Load Current User Success', props<{ user: User }>());
export const loadCurrentUserFailure = createAction('[Users] Load Current User Failure', props<{ error: string }>());