import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, filter, map, of, withLatestFrom } from 'rxjs';
import { AuthActions } from '../../auth/store/auth.actions';
import { CurrencyService } from '../currency.service';
import { CurrencyActions } from './currency.actions';
import { selectCurrenciesLoaded, selectCurrenciesLoading } from './currency.selector';

@Injectable()
export class CurrencyEffect {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly currencyService = inject(CurrencyService);

  triggerLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.restoreSession, AuthActions.loginSuccess),
      withLatestFrom(
        this.store.select(selectCurrenciesLoaded),
        this.store.select(selectCurrenciesLoading),
      ),
      filter(([, loaded]) => !loaded),
      map(() => CurrencyActions.load()),
    ),
  );

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrencyActions.load),
      exhaustMap(() =>
        this.currencyService.getAll().pipe(
          map((currencies) => CurrencyActions.loadSuccess({ currencies })),
          catchError((e) => of(CurrencyActions.loadFailure({ error: e?.message ?? 'Failed to load currencies' })),
          ),
        ),
      ),
    ),
  );
}