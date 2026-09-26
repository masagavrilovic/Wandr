import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideStore, Store } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { authReducer } from './auth/store/auth.reducer';
import { AuthEffects } from './auth/store/auth.effects';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth/auth.interceptor';
import { AuthActions } from './auth/store/auth.actions';
import { catchError, filter, firstValueFrom, of, timeout } from 'rxjs';
import { selectInitialized } from './auth/store/auth.selectors';
import { TripsEffect } from './trips/store/trips.effects';
import { tripsReducer } from './trips/store/trips.reducer';
import { activityReducer } from './activities/store/activities.reducer';
import { ActivityEffect } from './activities/store/activities.effects';
import { packingListReducer } from './packing-list/store/packing-list.reducer';
import { PackingListEffect } from './packing-list/store/packing-list.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideStore({
      auth: authReducer,
      trips: tripsReducer,
      activities: activityReducer,
      packingList: packingListReducer
    }),
    provideEffects([AuthEffects, TripsEffect, ActivityEffect, PackingListEffect, ]),
    provideAppInitializer(() => {
      const store = inject(Store);
      store.dispatch(AuthActions.restoreSession());
      
      return firstValueFrom(
        store.select(selectInitialized).pipe(
          filter(Boolean),
          timeout(3000),
          catchError(() => of(true))
        )
      );
    })
  ],
};
