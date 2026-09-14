import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { tripsReducer } from './trips/store/trips.reducer';
import { authInterceptor } from './auth/auth.interceptor';
import { TripsEffects } from './trips/store/trips.effects';
import { UserEffects } from './users/store/users.effects';
import { userReducer } from './users/store/users.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideStore({ 
      trips: tripsReducer,
      users: userReducer
    }),
    provideEffects([TripsEffects, UserEffects]),
  ],
};
