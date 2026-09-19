import { createReducer, on } from '@ngrx/store';
import { AuthActions } from './auth.actions';
import { User } from '../auth.models';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  initialized: false,
};

export const authReducer = createReducer(
    initialState,
    on(AuthActions.login, AuthActions.register, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(AuthActions.loginSuccess, AuthActions.registerSuccess, (state, { user }) => ({
      ...state,
      user,
      loading: false,
    })),
    on(AuthActions.loginFailure, AuthActions.registerFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    on(AuthActions.sessionRestored, (state, { user }) => ({
      ...state,
      user,
      initialized: true,
    })),
    on(AuthActions.sessionRestoreFailed, (state) => ({
      ...state,
      user: null,
      initialized: true,
    })),
    on(AuthActions.logoutSuccess, AuthActions.sessionExpired, () => ({
      ...initialState,
      initialized: true,
    })),
    on(AuthActions.clearError, (state) => ({ ...state, error: null })),
);