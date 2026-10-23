import { Action, ActionReducer } from '@ngrx/store';
import { AuthActions } from '../../auth/store/auth.actions';

const KEPT_KEYS = ['auth', 'router', 'currencies'] as const;

const RESET_ACTION_TYPES: string[] = [
  AuthActions.logoutSuccess.type,
  AuthActions.sessionExpired.type,
];

export function resetOnLogoutMetaReducer(reducer: ActionReducer<any, Action>): ActionReducer<any, Action> {
  return (state, action) => {
    if (state && RESET_ACTION_TYPES.includes(action.type)) {
      const kept: Record<string, unknown> = {};
      for (const key of KEPT_KEYS) {
        kept[key] = state[key];
      }
      return reducer(kept, action);
    }
    return reducer(state, action);
  };
}