import { Component, Input } from '@angular/core';
import { Expense } from '../expenses.models';
import { getExpenseCategoryMeta } from '../expense-category-meta';
import { DatePipe } from '@angular/common';

@Component({
  imports: [DatePipe],
  selector: 'app-expense-item',
  templateUrl: './expense-item.html',
})
export class ExpenseItem {
  @Input({ required: true }) expense!: Expense;

    get meta() {
      return getExpenseCategoryMeta(this.expense.category);
    }
}
