import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Currency } from '../currency.models';

export const CurrencyActions = createActionGroup({
  source: 'Currency',
  events: {
    'Load': emptyProps(),
    'Load Success': props<{ currencies: Currency[] }>(),
    'Load Failure': props<{ error: string }>(),
  },
});