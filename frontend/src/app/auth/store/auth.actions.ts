import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { LoginCredentials, RegisterData, User } from "../auth.models";

export const AuthActions = createActionGroup({
    source: 'Auth',
    events: {
        Login: props<{ credentials: LoginCredentials }>(),
        'Login Success': props<{ user: User }>(),
        'Login Failure': props<{ error: string }>(),

        Register: props<{ data: RegisterData }>(),
        'Register Success': props<{ user: User }>(),
        'Register Failure': props<{ error: string }>(),

        Logout: emptyProps(),
        'Logout Success': emptyProps(),

        'Session Expired': emptyProps(),
        'Restore Session': emptyProps(),
        'Session Restored': props<{ user: User }>(),
        'Session Restore Failed': emptyProps(),

        'Clear Error': emptyProps(),
    }
})