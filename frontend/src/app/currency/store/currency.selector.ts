import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CurrenciesState, currenciesAdapter } from './currency.reducer'; 

const selectCurrenciesState = createFeatureSelector<CurrenciesState>('currencies');

const { selectAll, selectEntities } = currenciesAdapter.getSelectors(selectCurrenciesState);

export const selectAllCurrencies = selectAll;
export const selectCurrencyEntities = selectEntities;
export const selectCurrenciesLoaded = createSelector(selectCurrenciesState, (s) => s.loaded);
export const selectCurrenciesLoading = createSelector(selectCurrenciesState, (s) => s.loading);

export const selectCurrencyByCode = (code: string) => createSelector(selectCurrencyEntities, (entities) => entities[code]);

export const selectMinorUnits = (code: string) => createSelector(selectCurrencyByCode(code), (c) => c?.minorUnits);