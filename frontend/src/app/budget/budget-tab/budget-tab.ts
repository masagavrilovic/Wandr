import { Component, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAllExpenses, selectExpenseDeleteErrors, selectExpensesLoading, selectExpensesLoadingError, selectExpensesTotal } from '../expenses/store/expenses.selectors';
import { AsyncPipe } from '@angular/common';
import { ExpenseItem } from '../expenses/components/expense-item/expense-item';
import { CreateUpdateExpense } from '../expenses/components/create-update-expense/create-update-expense';
import { selectTripById } from '../../trips/store/trips.selectors';
import { combineLatest, map, startWith, take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DeleteExpenseActions } from '../expenses/store/expenses.actions';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ExpenseChart } from '../summary/components/expense-chart/expense-chart';
import { Settlements } from '../summary/components/settlements/settlements';
import { ExpenseCategory } from '../expenses/expenses.models';

@Component({
  imports: [AsyncPipe, ExpenseItem, CreateUpdateExpense, ReactiveFormsModule, ExpenseChart, Settlements],
  selector: 'app-budget-tab',
  templateUrl: './budget-tab.html',
})
export class BudgetTab {
  private store = inject(Store);
  private route = inject(ActivatedRoute);
   
  isLoading$ = this.store.select(selectExpensesLoading);
  loadError$ = this.store.select(selectExpensesLoadingError);
  deleteErrors$ = this.store.select(selectExpenseDeleteErrors);
  
  categories = Object.values(ExpenseCategory);
  categoryControl = new FormControl<ExpenseCategory | 'all'>('all', { nonNullable: true });

  expenses$ = combineLatest([
    this.store.select(selectAllExpenses),
    this.categoryControl.valueChanges.pipe(startWith(this.categoryControl.value)),
  ]).pipe(
    map(([expenses, category]) =>
      category === 'all'
        ? expenses
        : expenses.filter((e) => e.category === category)
    )
  );
  totalExpenses$ = this.expenses$.pipe(map((expenses) => expenses.length));
  
  showCreateModal = signal(false);
  baseCurrency = '';
  tripId!: number;

  ngOnInit(): void {
    this.tripId = Number(this.route.parent!.snapshot.paramMap.get('id'));
    this.store
      .select(selectTripById(this.tripId))
      .pipe(take(1))
      .subscribe((trip) => (this.baseCurrency = trip?.baseCurrency ?? ''));
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
}
