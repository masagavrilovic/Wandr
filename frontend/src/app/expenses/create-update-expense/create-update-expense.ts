import { Component, DestroyRef, EventEmitter, inject, Input, numberAttribute, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { EMPTY, Observable, Subject, catchError, combineLatest, defer, distinctUntilChanged, map, merge, startWith, switchMap, tap } from 'rxjs';
import { CurrencyService } from '../../currency/currency.service';
import { ExchangeRateService, todayLocal } from '../exchange-rate.service';
import { CreateExpenseActions } from '../store/expenses.actions';
import { selectExpenseCreating, selectExpenseCreatingError } from '../store/expenses.selectors';
import { ExpenseCategory } from '../expenses.models';

type RateState = 'idle' | 'loading' | 'same' | 'auto' | 'error';

@Component({
  imports: [AsyncPipe, ReactiveFormsModule],
  selector: 'app-create-update-expense',
  templateUrl: './create-update-expense.html',
})
export class CreateUpdateExpense implements OnInit {
  @Input({ transform: numberAttribute }) tripId!: number;
  @Input({ required: true }) baseCurrency!: string;
  @Output() closed = new EventEmitter();

  private fb = inject(FormBuilder);
  private store = inject(Store);
  private actions$ = inject(Actions);
  private destroyRef = inject(DestroyRef);
  private exchangeRateService = inject(ExchangeRateService);
  private currencyService = inject(CurrencyService);

  isSaving$!: Observable<boolean>;
  error$!: Observable<string | null>;

  categories = Object.values(ExpenseCategory);
  currencies$ = this.currencyService.getAll();
  amountStep$!: Observable<string>;

  rateState: RateState = 'idle';
  manualRate = false;

  private refresh$ = new Subject<void>();

  expenseForm = this.fb.group({
    description: ['', [Validators.required]],
    paidAt: [todayLocal(), [Validators.required]],
    amount: new FormControl<number | null>(null, [Validators.required, Validators.min(0.000001)]),
    currency: ['', [Validators.required]],
    exchangeRate: new FormControl<number | null>(null, [Validators.required, Validators.min(0.000000000001)]),
    category: [ExpenseCategory.OTHER, [Validators.required]],
  });

  constructor() {
    this.actions$
      .pipe(
        ofType(CreateExpenseActions.createExpenseSuccess),
        takeUntilDestroyed()
      )
      .subscribe(() => this.close());
  }

  ngOnInit(): void {
    this.isSaving$ = this.store.select(selectExpenseCreating);
    this.error$ = this.store.select(selectExpenseCreatingError);
    this.store.dispatch(CreateExpenseActions.clearCreateError());

    const { currency, paidAt } = this.expenseForm.controls;
    currency.setValue(this.baseCurrency);

    this.amountStep$ = this.createAmountStep();

    merge(currency.valueChanges, paidAt.valueChanges, this.refresh$)
      .pipe(
        startWith(null),
        switchMap(() => this.fetchRate()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  get rateEditable(): boolean {
    return this.manualRate || this.rateState === 'error';
  }

  private createAmountStep(): Observable<string> {
    const currencyControl = this.expenseForm.controls.currency;
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

  private fetchRate() {
    const { currency, paidAt, exchangeRate } = this.expenseForm.controls;

    this.manualRate = false;

    if (!currency.value || !paidAt.value) {
      this.rateState = 'idle';
      return EMPTY;
    }

    if (currency.value === this.baseCurrency) {
      exchangeRate.setValue(1);
      this.rateState = 'same';
      return EMPTY;
    }

    this.rateState = 'loading';
    exchangeRate.setValue(null);

    return this.exchangeRateService.getRate(currency.value, this.baseCurrency, paidAt.value).pipe(
      tap((rate) => {
        exchangeRate.setValue(rate);
        this.rateState = 'auto';
      }),
      catchError(() => {
        exchangeRate.setValue(null);
        this.rateState = 'error';
        return EMPTY;
      })
    );
  }

  enableManualRate(): void {
    this.manualRate = true;
  }

  retryRate(): void {
    this.refresh$.next();
  }

  onSubmit() {
    if (this.expenseForm.invalid || this.rateState === 'loading') {
      this.expenseForm.markAllAsTouched();
      return;
    }

    const { description, paidAt, amount, currency, exchangeRate, category } = this.expenseForm.getRawValue();

    const payload = {
      description: description!.trim(),
      paidAt: paidAt!,
      amount: Number(amount),
      currency: currency!,
      exchangeRate: Number(exchangeRate),
      category: category!,
    };

    this.store.dispatch(CreateExpenseActions.createExpense({ tripId: this.tripId, payload }));
  }

  close(isSaving?: boolean | null) {
    if (!isSaving) this.closed.emit();
  }
}