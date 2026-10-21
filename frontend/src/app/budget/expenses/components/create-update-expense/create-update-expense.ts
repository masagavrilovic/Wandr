import { Component, DestroyRef, EventEmitter, inject, Input, numberAttribute, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { EMPTY, Observable, Subject, catchError, combineLatest, defer, distinctUntilChanged, map, merge, startWith, switchMap, take, tap } from 'rxjs';
import { ExchangeRateService, todayLocal } from '../../../exchange-rate.service';
import { CreateExpenseActions, DeleteExpenseActions, UpdateExpenseActions } from '../../store/expenses.actions';
import { selectExpenseCreating, selectExpenseCreatingError, selectExpenseUpdating, selectExpenseUpdatingError } from '../../store/expenses.selectors';
import { Expense, ExpenseCategory } from '../../expenses.models';
import { UserSummary } from '../../../../user/user.models';
import { selectTripById } from '../../../../trips/store/trips.selectors';
import { selectUser } from '../../../../auth/store/auth.selectors';
import { selectAllCurrencies } from '../../../../currency/store/currency.selector';

type RateState = 'idle' | 'loading' | 'same' | 'auto' | 'error';

@Component({
  imports: [AsyncPipe, ReactiveFormsModule],
  selector: 'app-create-update-expense',
  templateUrl: './create-update-expense.html',
})
export class CreateUpdateExpense implements OnInit {
  @Input({ required: true }) tripId!: number;
  @Input({ required: true }) baseCurrency!: string;
  @Input() expense: Expense | null = null;
  @Output() closed = new EventEmitter();

  private fb = inject(FormBuilder);
  private store = inject(Store);
  private actions$ = inject(Actions);
  private destroyRef = inject(DestroyRef);
  private exchangeRateService = inject(ExchangeRateService);

  isEditMode = false;

  isSaving$!: Observable<boolean>;
  error$!: Observable<string | null>;

  categories = Object.values(ExpenseCategory);
  currencies$ = this.store.select(selectAllCurrencies);
  amountStep$!: Observable<string>;

  rateState: RateState = 'idle';
  manualRate = false;

  private refresh$ = new Subject<void>();

  isChecked = signal(true);
  members = signal<UserSummary[]>([]);
  selectedIds = signal<Set<number>>(new Set());
  payerId!: number;

  expenseForm = this.fb.group({
    description: ['', [Validators.required]],
    paidAt: [todayLocal(), [Validators.required]],
    amount: new FormControl<number | null>(null, [Validators.required, Validators.min(0.000001)]),
    currency: ['', [Validators.required]],
    exchangeRate: new FormControl<number | null>(null, [Validators.required, Validators.min(0.000000000001)]),
    category: [ExpenseCategory.OTHER, [Validators.required]],
  });

  showDeleteModal = signal(false);
  openDeleteModal(): void {
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
  }

  confirmDelete(): void {
    this.store.dispatch(DeleteExpenseActions.deleteExpense({ tripId: this.tripId, id: this.expense!.id}));
    this.showDeleteModal.set(false);
    this.close();
  }

  constructor() {
    this.actions$
      .pipe(
        ofType(CreateExpenseActions.createExpenseSuccess, UpdateExpenseActions.updateExpenseSuccess),
        takeUntilDestroyed()
      )
      .subscribe(() => this.close());
  }

  ngOnInit(): void {
    this.isEditMode = !!this.expense;

    if (this.isEditMode) {
      this.payerId = this.expense!.paidBy.id;
    } else {
      this.store.select(selectUser).pipe(take(1)).subscribe((u) => (this.payerId = u!.id));
    }

    this.store.select(selectTripById(this.tripId))
      .pipe(take(1))
      .subscribe((trip) =>
        this.members.set((trip?.members ?? []).filter((m) => m.id !== this.payerId))
      );

    if (this.isEditMode) {
      this.isSaving$ = this.store.select(selectExpenseUpdating);
      this.error$ = this.store.select(selectExpenseUpdatingError);
      this.store.dispatch(UpdateExpenseActions.clearUpdateError());
      this.patchFormFromExpense(this.expense!);
    } else {
      this.isSaving$ = this.store.select(selectExpenseCreating);
      this.error$ = this.store.select(selectExpenseCreatingError);
      this.store.dispatch(CreateExpenseActions.clearCreateError());
      this.expenseForm.controls.currency.setValue(this.baseCurrency);
    }

    this.amountStep$ = this.createAmountStep();

    const { currency, paidAt } = this.expenseForm.controls;

    merge(currency.valueChanges, paidAt.valueChanges, this.refresh$)
      .pipe(
        startWith(null),
        switchMap((trigger, index) => {
          if (this.isEditMode && index === 0) return EMPTY;
          return this.fetchRate();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  get rateEditable(): boolean {
    return this.manualRate || this.rateState === 'error';
  }

  private patchFormFromExpense(expense: Expense): void {
    this.expenseForm.patchValue({
      description: expense.description,
      paidAt: expense.paidAt,
      amount: expense.amount,
      currency: expense.currency,
      exchangeRate: expense.exchangeRate,
      category: expense.category,
    });

    this.rateState = expense.currency === this.baseCurrency ? 'same' : 'auto';
    
    const selected = expense.participantIds.filter((id) => id !== this.payerId);
    this.selectedIds.set(new Set(selected));
    this.isChecked.set(this.members().every((m) => selected.includes(m.id)));
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

  toggleMember(id: number, checked: boolean): void {
    this.selectedIds.update((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  onSubmit() {
    if (this.expenseForm.invalid || this.rateState === 'loading') {
      this.expenseForm.markAllAsTouched();
      return;
    }

    const { description, paidAt, amount, currency, exchangeRate, category } = this.expenseForm.getRawValue();

    const participantIds = [
      this.payerId,
      ...(this.isChecked() ? this.members().map((m) => m.id) : this.selectedIds()),
    ];

    const payload = {
      description: description!,
      paidAt: paidAt!,
      amount: amount!,
      currency: currency!,
      exchangeRate: exchangeRate!,
      category: category!,
      participantIds,
    };

    if (this.isEditMode) {
      this.store.dispatch(UpdateExpenseActions.updateExpense({
        tripId: this.tripId,
        id: this.expense!.id,
        payload,
      }));
    } else {
      this.store.dispatch(CreateExpenseActions.createExpense({ tripId: this.tripId, payload }));
    }
  }

  close(isSaving?: boolean | null) {
    if (!isSaving) this.closed.emit();
  }
}