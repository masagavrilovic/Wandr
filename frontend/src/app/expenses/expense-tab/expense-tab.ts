import { Component, DestroyRef, inject, Input, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAllExpenses, selectExpenseCreating, selectExpenseCreatingError, selectExpensesLoading, selectExpensesLoadingError, selectExpensesTotal } from '../store/expenses.selectors';
import { AsyncPipe } from '@angular/common';
import { ExpenseItem } from '../expense-item/expense-item';
import { CreateUpdateExpense } from '../create-update-expense/create-update-expense';
import { selectTripById } from '../../trips/store/trips.selectors';
import { take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  imports: [AsyncPipe, ExpenseItem, CreateUpdateExpense],
  selector: 'app-expense-tab',
  templateUrl: './expense-tab.html',
})
export class ExpenseTab {
  private store = inject(Store);
  private route = inject(ActivatedRoute);
   
  isLoading$ = this.store.select(selectExpensesLoading);
  loadError$ = this.store.select(selectExpensesLoadingError);
  expenses$ = this.store.select(selectAllExpenses);
  totalExpenses$ = this.store.select(selectExpensesTotal);
  
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
}
