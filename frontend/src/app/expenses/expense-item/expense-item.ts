import { Component, Input, signal } from '@angular/core';
import { Expense } from '../expenses.models';
import { getExpenseCategoryMeta } from '../expense-category-meta';
import { DatePipe } from '@angular/common';
import { CreateUpdateExpense } from '../create-update-expense/create-update-expense';

@Component({
  imports: [DatePipe, CreateUpdateExpense],
  standalone: true,
  selector: 'app-expense-item',
  templateUrl: './expense-item.html',
})
export class ExpenseItem {
  @Input({ required: true }) expense!: Expense;
  @Input({ required: true }) tripId!: number;

  get meta() {
    return getExpenseCategoryMeta(this.expense.category);
  }

  showEditModal = signal(false);

  openEditModal(): void {
    this.showEditModal.set(true);
  }

  closeEditModal(): void {
    this.showEditModal.set(false);
  }
}
