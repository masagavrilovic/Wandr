import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAllExpenses, selectExpenseDeleteErrors, selectExpenseHasNextPage, selectExpensesLoading, selectExpensesLoadingError } from '../expenses/store/expenses.selectors';
import { AsyncPipe } from '@angular/common';
import { ExpenseItem } from '../expenses/components/expense-item/expense-item';
import { CreateUpdateExpense } from '../expenses/components/create-update-expense/create-update-expense';
import { selectTripById } from '../../trips/store/trips.selectors';
import { combineLatest, map, startWith, take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DeleteExpenseActions, LoadExpensesActions } from '../expenses/store/expenses.actions';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ExpenseChart } from '../summary/components/expense-chart/expense-chart';
import { Settlements } from '../summary/components/settlements/settlements';
import { ExpenseCategory } from '../expenses/expenses.models';
import { PaymentList } from '../payments/components/payment-list/payment-list';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  imports: [AsyncPipe, ExpenseItem, CreateUpdateExpense, ReactiveFormsModule, ExpenseChart, Settlements, PaymentList],
  selector: 'app-budget-tab',
  templateUrl: './budget-tab.html',
})
export class BudgetTab {
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
   
  isLoading$ = this.store.select(selectExpensesLoading);
  loadError$ = this.store.select(selectExpensesLoadingError);
  deleteErrors$ = this.store.select(selectExpenseDeleteErrors);
  
  categories = Object.values(ExpenseCategory);
  categoryControl = new FormControl<ExpenseCategory | 'all'>('all', { nonNullable: true });

  expenses$ = this.store.select(selectAllExpenses);
  showTracker$ = combineLatest([
    this.expenses$,
    this.categoryControl.valueChanges.pipe(startWith(this.categoryControl.value)),
  ]).pipe(map(([expenses, category]) => expenses.length > 0 || category !== 'all'));
  
  showCreateModal = signal(false);
  baseCurrency = '';
  tripId!: number;

  ngOnInit(): void {
    this.tripId = Number(this.route.parent!.snapshot.paramMap.get('id'));
    this.store
      .select(selectTripById(this.tripId))
      .pipe(take(1))
      .subscribe((trip) => (this.baseCurrency = trip?.baseCurrency ?? ''));

    this.categoryControl.valueChanges
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(() =>
      this.store.dispatch(
        LoadExpensesActions.loadExpenses({
          tripId: this.tripId,
          cursor: null,
          category: this.selectedCategory,
        })
      )
    );
  }

  openCreateModal() {
    this.showCreateModal.set(true);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
  }

  onDelete(expenseId: number): void {
    this.store.dispatch(DeleteExpenseActions.deleteExpense({ tripId: this.tripId, id: expenseId }));
  }
  
  dismissDeleteError(id: number): void {
    this.store.dispatch(DeleteExpenseActions.clearDeleteError({ id }));
  }

  private get selectedCategory(): ExpenseCategory | null {
    const value = this.categoryControl.value;
    return value === 'all' ? null : value;
  }

  onScroll(event: Event): void {
    const element = event.target as HTMLElement;
    const atBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 50;
    if (!atBottom) return;

    combineLatest([this.store.select(selectExpenseHasNextPage), this.isLoading$])
      .pipe(take(1))
      .subscribe(([hasNextPage, isLoading]) => {
        if (hasNextPage && !isLoading) {
          this.store.dispatch(
            LoadExpensesActions.loadExpenses({ tripId: this.tripId, category: this.selectedCategory })
          );
        }
      });
    }
}
