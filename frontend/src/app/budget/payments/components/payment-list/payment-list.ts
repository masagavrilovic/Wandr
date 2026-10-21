import { Component, inject, Input, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAllPayments } from '../../store/payments.selectors';
import { AsyncPipe } from '@angular/common';
import { CreateUpdatePayment } from '../create-update-payment/create-update-payment';
import { PaymentItem } from '../payment-item/payment-item';

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
}
