import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAllExpenses, selectCanLoadMoreExpenses, selectExpenseCategoryFilter, selectExpenseDeleteErrors, selectExpensesInitialLoading, selectExpensesLoadingError, selectExpensesMoreError, selectExpensesMoreLoading, selectShowExpenseTracker } from '../expenses/store/expenses.selectors';
import { AsyncPipe } from '@angular/common';
import { ExpenseItem } from '../expenses/components/expense-item/expense-item';
import { CreateUpdateExpense } from '../expenses/components/create-update-expense/create-update-expense';
import { selectSelectedTripBaseCurrency, selectSelectedTripId } from '../../trips/store/trips.selectors';
import { distinctUntilChanged, take } from 'rxjs';
import { BudgetTabActions, DeleteExpenseActions, ExpenseFilterActions, LoadExpensesActions } from '../expenses/store/expenses.actions';
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
  private destroyRef = inject(DestroyRef);
    
  categories = Object.values(ExpenseCategory);
  categoryControl = new FormControl<ExpenseCategory | 'all'>('all', { nonNullable: true });

  expenses$ = this.store.select(selectAllExpenses);
  showTracker$ = this.store.select(selectShowExpenseTracker);
  initialLoading$ = this.store.select(selectExpensesInitialLoading);
  moreLoading$ = this.store.select(selectExpensesMoreLoading);
  loadError$ = this.store.select(selectExpensesLoadingError);
  moreError$ = this.store.select(selectExpensesMoreError);
  deleteErrors$ = this.store.select(selectExpenseDeleteErrors);
  
  showCreateModal = signal(false);
  baseCurrency$ = this.store.select(selectSelectedTripBaseCurrency);
  tripId$ = this.store.select(selectSelectedTripId);

  ngOnInit(): void {
    this.store
      .select(selectExpenseCategoryFilter)
      .pipe(take(1))
      .subscribe((category) => this.categoryControl.setValue(category ?? 'all', { emitEvent: false }));
      
    this.store.dispatch(BudgetTabActions.opened());
    
    this.categoryControl.valueChanges
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) =>
        this.store.dispatch(ExpenseFilterActions.setCategory({ category: value === 'all' ? null : value }))
    );
  }

  openCreateModal() {
    this.showCreateModal.set(true);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
  }

  onDelete(expenseId: number): void {
    this.store.dispatch(DeleteExpenseActions.deleteExpense({ id: expenseId }));
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

    this.store
      .select(selectCanLoadMoreExpenses)
      .pipe(take(1))
      .subscribe((canLoadMore) => {
        if (canLoadMore) this.store.dispatch(LoadExpensesActions.loadMoreExpenses());
      });
    }
}
