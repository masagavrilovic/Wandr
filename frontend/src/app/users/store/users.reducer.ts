// state/user/user.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { User } from '../users.models';
import { loadCurrentUser, loadCurrentUserFailure, loadCurrentUserSuccess } from './users.actions';

export interface UserState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

export const initialState: UserState = {
  currentUser: null,
  loading: false,
  error: null,
};

export const userReducer = createReducer(
  initialState,
  on(loadCurrentUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(loadCurrentUserSuccess, (state, { user }) => ({
    ...state,
    currentUser: user,
    loading: false,
  })),
  on(loadCurrentUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);