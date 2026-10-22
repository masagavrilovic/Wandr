import { Component, inject, Input, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAllPayments } from '../../store/payments.selectors';
import { AsyncPipe } from '@angular/common';
import { CreateUpdatePayment } from '../create-update-payment/create-update-payment';
import { PaymentItem } from '../payment-item/payment-item';
import { LoadPaymentsActions } from '../../store/payments.actions';

@Component({
  imports: [AsyncPipe, CreateUpdatePayment, PaymentItem],
  selector: 'app-payment-list',
  templateUrl: './payment-list.html',
})
export class PaymentList {
  @Input({ required: true }) tripId!: number;
  @Input({ required: true }) baseCurrency!: string;
  private store = inject(Store);

  payments$ = this.store.select(selectAllPayments);

  showCreateModal = signal(false);
  openCreateModal() {
    this.showCreateModal.set(true);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
  } 
  
  onScroll(event: Event): void {
    const element = event.target as HTMLElement;
    const atBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 5;

    if (atBottom) this.store.dispatch(LoadPaymentsActions.loadPayment({ tripId: this.tripId }));
  }
}
