import { DatePipe } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { Payment } from '../../payments.models';
import { CreateUpdatePayment } from '../create-update-payment/create-update-payment';

@Component({
  imports: [DatePipe, CreateUpdatePayment],
  selector: 'app-payment-item',
  templateUrl: './payment-item.html',
})
export class PaymentItem {
  @Input({ required: true }) payment!: Payment;

  showEditModal = signal(false);

  openEditModal(): void {
    this.showEditModal.set(true);
  }

  closeEditModal(): void {
    this.showEditModal.set(false);
  }
}
