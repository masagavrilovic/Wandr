import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectUser = createSelector(selectAuthState, (state) => state.user);
export const selectLoading = createSelector(selectAuthState, (state) => state.loading);
export const selectError = createSelector(selectAuthState, (state) => state.error);
export const selectInitialized = createSelector(selectAuthState, (state) => state.initialized);
export const selectIsAuthenticated = createSelector(selectUser, (user) => !!user);

export const selectUserFullName = createSelector(selectUser, (user) => user ? `${user.firstName} ${user.lastName}` : '');
export const selectUserInitials = createSelector(selectUser, (user) => user ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() : '');