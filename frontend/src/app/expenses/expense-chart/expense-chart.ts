import { Component, inject, Input } from '@angular/core';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { BaseChartDirective } from 'ng2-charts';
import { ArcElement, Chart, ChartData, ChartOptions, DoughnutController, Tooltip } from 'chart.js';
import { map, Observable } from 'rxjs';
import { selectAllExpenses } from '../store/expenses.selectors';
import { Expense, ExpenseCategory } from '../expenses.models';
import { getExpenseCategoryMeta } from '../expense-category-meta';

Chart.register(DoughnutController, ArcElement, Tooltip);

export interface ChartSlice {
  category: ExpenseCategory;
  color: string;
  amount: number;
  percentLabel: string;
}

export interface ChartView {
  slices: ChartSlice[];
  total: number;
  currency: string;
  data: ChartData<'doughnut'>;
  options: ChartOptions<'doughnut'>;
}

@Component({
  selector: 'app-expense-chart',
  imports: [AsyncPipe, CurrencyPipe, BaseChartDirective],
  templateUrl: './expense-chart.html',
})
export class ExpenseChart {
  private store = inject(Store);
  @Input({ required: true }) baseCurrency!: string;

  view$: Observable<ChartView> = this.store.select(selectAllExpenses).pipe(map((expenses) => this.buildView(expenses)));

  private buildView(expenses: Expense[]): ChartView {
    const totals = new Map<ExpenseCategory, number>();
    for (const expense of expenses) {
      totals.set(expense.category, (totals.get(expense.category) ?? 0) + expense.baseAmount);
    }

    const entries = [...totals.entries()]
      .filter(([, amount]) => amount > 0)
      .sort((a, b) => b[1] - a[1]);

    const total = entries.reduce((sum, [, amount]) => sum + amount, 0);

    const slices: ChartSlice[] = entries.map(([category, amount]) => {
      const percent = (amount / total) * 100;
      return {
        category,
        color: getExpenseCategoryMeta(category).color,
        amount,
        percentLabel: percent < 0.1 ? '<0.1%' : `${percent.toFixed(1)}%`,
      };
    });

    const data: ChartData<'doughnut'> = {
      labels: entries.map(([category]) => category),
      datasets: [
        {
          data: entries.map(([, amount]) => amount),
          backgroundColor: slices.map((s) => s.color),
          borderColor: '#ffffff',
          borderWidth: 2,
          hoverOffset: 4,
        },
      ],
    };

    const options: ChartOptions<'doughnut'> = {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '68%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const slice = slices[ctx.dataIndex];
              return ` ${slice.category}: ${slice.amount} (${slice.percentLabel})`;
            },
          },
        },
      },
    };

    return { slices, total, currency: this.baseCurrency, data, options };
  }
}