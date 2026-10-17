import { Component, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAllExpenses, selectExpenseCreating, selectExpenseCreatingError, selectExpensesLoading, selectExpensesLoadingError, selectExpensesTotal } from '../store/expenses.selectors';
import { AsyncPipe } from '@angular/common';
import { ExpenseItem } from '../expense-item/expense-item';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { selectTripById } from '../../trips/store/trips.selectors';
import { CreateUpdateExpense } from '../create-update-expense/create-update-expense';

@Component({
  imports: [AsyncPipe, ExpenseItem, CreateUpdateExpense],
  selector: 'app-expense-tab',
  templateUrl: './expense-tab.html',
})
export class ExpenseTab {
  private store = inject(Store);

  isLoading$ = this.store.select(selectExpensesLoading);
  loadError$ = this.store.select(selectExpensesLoadingError);
  expenses$ = this.store.select(selectAllExpenses);
  totalExpenses$ = this.store.select(selectExpensesTotal);

  isCreating$ = this.store.select(selectExpenseCreating);
  createError$ = this.store.select(selectExpenseCreatingError);
  showCreateModal = signal(false);
  private route = inject(ActivatedRoute);

  private tripId$ = this.route.parent!.paramMap.pipe(map((params) => Number(params.get('id'))));
  trip$ = this.tripId$.pipe(switchMap((id) => this.store.select(selectTripById(id))));

  openCreateModal() {
    this.showCreateModal.set(true);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
  }
}
