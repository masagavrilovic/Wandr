import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './users.reducer';

export const selectUserState = createFeatureSelector<UserState>('users');

export const selectCurrentUser = createSelector(
  selectUserState,
  (state) => state.currentUser,
);

export const selectFullName = createSelector(selectCurrentUser, (user) =>
  user ? `${user.firstName} ${user.lastName}` : '',
);

export const selectInitials = createSelector(selectCurrentUser, (user) => {
  if (!user) return '';
  return `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase();
});

export const selectUserLoading = createSelector(
  selectUserState,
  (state) => state.loading,
);