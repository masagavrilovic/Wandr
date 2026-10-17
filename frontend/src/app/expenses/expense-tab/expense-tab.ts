import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAllExpenses, selectExpensesLoading, selectExpensesLoadingError, selectExpensesTotal } from '../store/expenses.selectors';
import { AsyncPipe } from '@angular/common';
import { ExpenseItem } from '../expense-item/expense-item';

@Component({
  imports: [AsyncPipe, ExpenseItem],
  selector: 'app-expense-tab',
  templateUrl: './expense-tab.html',
})
export class ExpenseTab {
  private store = inject(Store);

  isLoading$ = this.store.select(selectExpensesLoading);
  loadError$ = this.store.select(selectExpensesLoadingError);
  expenses$ = this.store.select(selectAllExpenses);
  totalExpenses$ = this.store.select(selectExpensesTotal);

  openCreateModal() {
    
  }
}
