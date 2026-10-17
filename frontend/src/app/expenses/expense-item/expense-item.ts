import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
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
  @Output() onDelete = new EventEmitter<number>();

  get meta() {
    return getExpenseCategoryMeta(this.expense.category);
  }

  showEditModal = signal(false);
  showDeleteModal = signal(false);
  openEditModal(): void {
    this.showEditModal.set(true);
  }

  closeEditModal(): void {
    this.showEditModal.set(false);
  }

    openDeleteModal(): void {
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
  }

  confirmDelete(): void {
    this.onDelete.emit(this.expense.id);
    this.showDeleteModal.set(false);
  }
}
