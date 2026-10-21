import { Component, EventEmitter, inject, Input, Output, signal, viewChild } from '@angular/core';
import { Payment } from '../../payments.models';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, defer, distinctUntilChanged, map, Observable, startWith, take } from 'rxjs';
import { ExchangeRateField, RateState } from '../../../exchange-rate-field/exchange-rate-field';
import { selectAllCurrencies } from '../../../../currency/store/currency.selector';
import { UserSummary } from '../../../../user/user.models';
import { todayLocal } from '../../../exchange-rate.service';
import { CreatePaymentActions, DeletePaymentActions, UpdatePaymentActions } from '../../store/payments.actions';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { selectUser } from '../../../../auth/store/auth.selectors';
import { selectTripById } from '../../../../trips/store/trips.selectors';
import { selectPaymentUpdating, selectPaymentUpdatingError, selectPaymentCreating, selectPaymentCreatingError } from '../../store/payments.selectors';

@Component({
  imports: [AsyncPipe, ReactiveFormsModule, ExchangeRateField],
  selector: 'app-create-update-payment',
  templateUrl: './create-update-payment.html',
})
export class CreateUpdatePayment {
  @Input({ required: true }) tripId!: number;
  @Input({ required: true }) baseCurrency!: string;
  @Input() payment: Payment | null = null;
  @Output() closed = new EventEmitter();

  private fb = inject(FormBuilder);
  private store = inject(Store);
  private actions$ = inject(Actions);

  isEditMode = false;

  isSaving$!: Observable<boolean>;
  error$!: Observable<string | null>;

  currencies$ = this.store.select(selectAllCurrencies);
  amountStep$!: Observable<string>;
  rateState = signal<RateState>('idle');

  members = signal<UserSummary[]>([]);
  payerId!: number;

  paymentForm = this.fb.group({
    toUserId: new FormControl<number | null>(null, [Validators.required]),
    paidAt: [todayLocal(), [Validators.required]],
    amount: new FormControl<number | null>(null, [Validators.required, Validators.min(0.000001)]),
    currency: ['', [Validators.required]],
    exchangeRate: new FormControl<number | null>(null, [Validators.required, Validators.min(0.000000000001)]),
  });

  showDeleteModal = signal(false);
  openDeleteModal(): void {
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
  }

  confirmDelete(): void {
    this.store.dispatch(DeletePaymentActions.deletePayment({ tripId: this.tripId, id: this.payment!.id }));
    this.showDeleteModal.set(false);
    this.close();
  }

  constructor() {
    this.actions$
      .pipe(
        ofType(CreatePaymentActions.createPaymentSuccess, UpdatePaymentActions.updatePaymentSuccess),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.close());
  }

  ngOnInit(): void {
    this.isEditMode = !!this.payment;

    if (this.isEditMode) {
      this.payerId = this.payment!.from.id;
    } else {
      this.store.select(selectUser).pipe(take(1)).subscribe((u) => (this.payerId = u!.id));
    }

    this.store.select(selectTripById(this.tripId))
      .pipe(take(1))
      .subscribe((trip) => {
        const list = (trip?.members ?? []).filter((m) => m.id !== this.payerId);
        if (this.payment && !list.some((m) => m.id === this.payment!.to.id)) {
          list.push(this.payment.to);
        }
        this.members.set(list);
      });

    if (this.isEditMode) {
      this.isSaving$ = this.store.select(selectPaymentUpdating);
      this.error$ = this.store.select(selectPaymentUpdatingError);
      this.store.dispatch(UpdatePaymentActions.clearUpdateError());
      this.paymentForm.patchValue({
        toUserId: this.payment!.to.id,
        paidAt: this.payment!.paidAt,
        amount: this.payment!.amount,
        currency: this.payment!.currency,
        exchangeRate: this.payment!.exchangeRate,
      });
    } else {
      this.isSaving$ = this.store.select(selectPaymentCreating);
      this.error$ = this.store.select(selectPaymentCreatingError);
      this.store.dispatch(CreatePaymentActions.clearCreateError());
      this.paymentForm.controls.currency.setValue(this.baseCurrency);
    }

    this.amountStep$ = this.createAmountStep();
  }

  private createAmountStep(): Observable<string> {
    const currencyControl = this.paymentForm.controls.currency;

    const currencyCode$ = defer(() =>
      currencyControl.valueChanges.pipe(startWith(currencyControl.value))
    );

    return combineLatest([currencyCode$, this.currencies$]).pipe(
      map(([code, list]) => {
        const units = list.find((c) => c.code === code)?.minorUnits ?? 2;
        return units === 0 ? '1' : String(1 / Math.pow(10, units));
      }),
      distinctUntilChanged()
    );
  }

  onSubmit() {
    if (this.paymentForm.invalid || this.rateState() === 'loading') {
      this.paymentForm.markAllAsTouched();
      return;
    }

    const { toUserId, paidAt, amount, currency, exchangeRate } = this.paymentForm.getRawValue();

    const payload = {
      toUserId: toUserId!,
      paidAt: paidAt!,
      amount: amount!,
      currency: currency!,
      exchangeRate: exchangeRate!,
    };

    if (this.isEditMode) {
      this.store.dispatch(UpdatePaymentActions.updatePayment({
        tripId: this.tripId,
        id: this.payment!.id,
        payload,
      }));
    } else {
      this.store.dispatch(CreatePaymentActions.createPayment({ tripId: this.tripId, payload }));
    }
  }

  close(isSaving?: boolean | null) {
    if (!isSaving) this.closed.emit();
  }
}
