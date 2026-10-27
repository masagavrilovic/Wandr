import { ApplicationConfig, inject, isDevMode, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';
import { routes } from './app.routes';
import { provideStore, Store } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { NavigationActionTiming, provideRouterStore, routerReducer, RouterState } from '@ngrx/router-store';
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
import { expensesReducer } from './budget/expenses/store/expenses.reducer';
import { ExpensesEffect } from './budget/expenses/store/expenses.effects';
import { paymentsReducer } from './budget/payments/store/payments.reducer';
import { currenciesReducer } from './currency/store/currency.reducer';
import { CurrencyEffect } from './currency/store/currency.effects';
import { summaryReducer } from './budget/summary/store/summary.reducer';
import { PaymentsEffect } from './budget/payments/store/payments.effects';
import { SummaryEffect } from './budget/summary/store/summary.effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { resetOnLogoutMetaReducer } from './shared/store/reset.meta-reducer';
import { notesReducer } from './notes/store/notes.reducer';
import { NotesEffect } from './notes/store/notes.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withRouterConfig({ paramsInheritanceStrategy: 'always' })),
    provideStore(
      {
        router: routerReducer,
        auth: authReducer,
        trips: tripsReducer,
        activities: activityReducer,
        packingList: packingListReducer,
        expenses: expensesReducer,
        payments: paymentsReducer,
        currencies: currenciesReducer,
        summary: summaryReducer,
        notes: notesReducer,
      },
      { metaReducers: [resetOnLogoutMetaReducer] }
    ),
    provideRouterStore({
      routerState: RouterState.Minimal,
      navigationActionTiming: NavigationActionTiming.PostActivation,
    }),
    provideEffects([
      AuthEffects,
      TripsEffect,
      ActivityEffect,
      PackingListEffect,
      ExpensesEffect,
      PaymentsEffect,
      CurrencyEffect,
      SummaryEffect,
      NotesEffect,
    ]),
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
    }),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
    }),
  ],
};