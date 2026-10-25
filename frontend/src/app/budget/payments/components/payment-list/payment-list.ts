import { Component, inject, Input, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAllPayments, selectCanLoadMorePayments, selectPaymentDeleteErrors, selectPaymentsInitialLoading, selectPaymentsLoadingError, selectPaymentsMoreError, selectPaymentsMoreLoading } from '../../store/payments.selectors';
import { AsyncPipe } from '@angular/common';
import { CreateUpdatePayment } from '../create-update-payment/create-update-payment';
import { PaymentItem } from '../payment-item/payment-item';
import { DeletePaymentActions, LoadPaymentsActions } from '../../store/payments.actions';
import { take } from 'rxjs';

@Component({
  imports: [AsyncPipe, CreateUpdatePayment, PaymentItem],
  selector: 'app-payment-list',
  templateUrl: './payment-list.html',
})
export class PaymentList {
  private store = inject(Store);

  payments$ = this.store.select(selectAllPayments);
  initialLoading$ = this.store.select(selectPaymentsInitialLoading);
  loadError$ = this.store.select(selectPaymentsLoadingError);
  moreLoading$ = this.store.select(selectPaymentsMoreLoading);
  moreError$ = this.store.select(selectPaymentsMoreError);
  deleteErrors$ = this.store.select(selectPaymentDeleteErrors);

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
    if (!atBottom) return;

    this.store
      .select(selectCanLoadMorePayments)
      .pipe(take(1))
      .subscribe((canLoadMore) => {
        if (canLoadMore) this.store.dispatch(LoadPaymentsActions.loadMorePayments());
    });
  }

  dismissDeleteError(id: number): void {
    this.store.dispatch(DeletePaymentActions.clearDeleteError({ id }));
  }
}
