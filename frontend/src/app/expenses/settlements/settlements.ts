import { Component, inject, Input } from '@angular/core';
import { calculateSettlements, Settlement } from '../budget.util';
import { Store } from '@ngrx/store';
import { selectAllExpenses } from '../store/expenses.selectors';
import { combineLatest, map, Observable } from 'rxjs';
import { selectAllPayments } from '../store/payments.selectors';
import { AsyncPipe } from '@angular/common';
import { selectMinorUnits } from '../../currency/store/currency.selector';

@Component({
  imports: [AsyncPipe],
  selector: 'app-settlements',
  templateUrl: './settlements.html',
})
export class Settlements {
  @Input({ required: true }) baseCurrency!: string;
  private store = inject(Store);

  settlements$!: Observable<Settlement[]>;

  ngOnInit() {
    this.settlements$ = combineLatest([
      this.store.select(selectAllExpenses),
      this.store.select(selectAllPayments),
      this.store.select(selectMinorUnits(this.baseCurrency))
    ]).pipe(
      map(([expenses, payments, minorUnits]) => {
        console.log(minorUnits);
        return calculateSettlements(expenses, payments, minorUnits!);
      }),
    );
  }
}
