import { Component, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { selectSettlement, selectSettlementsError, selectSettlementsLoading } from '../../store/summary.selectors';
import { selectSelectedTripBaseCurrency } from '../../../../trips/store/trips.selectors';
import { CreateUpdatePayment } from '../../../payments/components/create-update-payment/create-update-payment';

@Component({
  imports: [AsyncPipe, CreateUpdatePayment],
  selector: 'app-settlements',
  templateUrl: './settlements.html',
})
export class Settlements {
  private store = inject(Store);

  settlements$ = this.store.select(selectSettlement);
  loading$ = this.store.select(selectSettlementsLoading);
  error$ = this.store.select(selectSettlementsError);
  baseCurrency$ = this.store.select(selectSelectedTripBaseCurrency);

  showCreatePayment = signal(false);

  openCreatePayment() {
    this.showCreatePayment.set(true);
  }

  closeCreatePayment() {
    this.showCreatePayment.set(false);
  }
}
