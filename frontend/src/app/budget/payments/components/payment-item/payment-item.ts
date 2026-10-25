import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject, Input, signal } from '@angular/core';
import { Payment } from '../../payments.models';
import { CreateUpdatePayment } from '../create-update-payment/create-update-payment';
import { distinctUntilChanged, map } from 'rxjs';
import { selectCurrentUserId } from '../../../../auth/store/auth.selectors';
import { Store } from '@ngrx/store';

@Component({
  imports: [DatePipe, CreateUpdatePayment, AsyncPipe],
  selector: 'app-payment-item',
  templateUrl: './payment-item.html',
})
export class PaymentItem {
  @Input({ required: true }) payment!: Payment;
  private store = inject(Store);

  showEditModal = signal(false);
  canEdit$ = this.store.select(selectCurrentUserId).pipe(
    map((userId) => userId !== null && (this.payment.from.id === userId || this.payment.to.id === userId)),
    distinctUntilChanged(),
  );

  openEditModal(): void {
    this.showEditModal.set(true);
  }

  closeEditModal(): void {
    this.showEditModal.set(false);
  }
}
