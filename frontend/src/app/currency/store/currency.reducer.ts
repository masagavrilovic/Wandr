import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Currency } from '../currency.models';
import { CurrencyActions } from './currency.actions';

export interface CurrenciesState extends EntityState<Currency> {
  loaded: boolean;
  loading: boolean;
  error: string | null;
}

export const currenciesAdapter: EntityAdapter<Currency> = createEntityAdapter<Currency>({
  selectId: (c) => c.code,
});

const initialState: CurrenciesState = currenciesAdapter.getInitialState({
  loaded: false,
  loading: false,
  error: null,
});

export const currenciesReducer = createReducer(
  initialState,
  on(CurrencyActions.load, (state) => ({ ...state, loading: true, error: null })),
  on(CurrencyActions.loadSuccess, (state, { currencies }) =>
    currenciesAdapter.setAll(currencies, { ...state, loading: false, loaded: true }),
  ),
  on(CurrencyActions.loadFailure, (state, { error }) => ({ ...state, loading: false, error })),
);