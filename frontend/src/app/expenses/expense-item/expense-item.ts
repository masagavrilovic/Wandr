import { Component, Input } from '@angular/core';
import { Expense } from '../expenses.models';

@Component({
  imports: [],
  selector: 'app-expense-item',
  templateUrl: './expense-item.html',
})
export class ExpenseItem {
  @Input({ required: true }) expense!: Expense;
}
