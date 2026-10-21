import { Component, inject, Input, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { selectSettlement } from '../../store/summary.selectors';

@Component({
  imports: [AsyncPipe],
  selector: 'app-settlements',
  templateUrl: './settlements.html',
})
export class Settlements {
  @Input({ required: true }) baseCurrency!: string;
  private store = inject(Store);

  settlements$ = this.store.select(selectSettlement);

  showCreatePayment = signal(false);

  openCreatePayment() {
    this.showCreatePayment.set(true);
  }

  closeCreatePayment() {
    this.showCreatePayment.set(false);
  }
}
