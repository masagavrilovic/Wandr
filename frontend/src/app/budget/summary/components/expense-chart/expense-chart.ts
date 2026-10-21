import { Component, inject, Input, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { BaseChartDirective } from 'ng2-charts';
import { ArcElement, Chart, ChartData, ChartOptions, DoughnutController, Tooltip } from 'chart.js';
import { combineLatest, map, Observable } from 'rxjs';
import { selectAllExpenses } from '../../../expenses/store/expenses.selectors';
import { selectMinorUnits } from '../../../../currency/store/currency.selector';
import { Expense, ExpenseCategory } from '../../../expenses/expenses.models';

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
  imports: [AsyncPipe, BaseChartDirective],
  templateUrl: './expense-chart.html',
})
export class ExpenseChart implements OnInit {
  private store = inject(Store);
  @Input({ required: true }) baseCurrency!: string;

  private readonly CHART_COLORS = [
    '#1f4e79',
    '#f0ce54',
    '#35b7a5',
    '#D95F4F',
    '#163756',
    '#e3bf3d',
    '#C94F40',
  ];

  view$!: Observable<ChartView>;

  ngOnInit() {
    this.view$ = combineLatest([
      this.store.select(selectAllExpenses),
      this.store.select(selectMinorUnits(this.baseCurrency)),
    ]).pipe(
      map(([expenses, minorUnits]) => this.buildView(expenses, minorUnits ?? 2)),
    );
  }
  private buildView(expenses: Expense[], minorUnits: number): ChartView {
    const totals = new Map<ExpenseCategory, number>();
    for (const expense of expenses) {
      totals.set(expense.category, (totals.get(expense.category) ?? 0) + expense.baseAmountMinor);
    }

    const entries = [...totals.entries()]
      .filter(([, amount]) => amount > 0)
      .sort((a, b) => b[1] - a[1]);

    const total = entries.reduce((sum, [, amount]) => sum + amount, 0);


    const slices: ChartSlice[] = entries.map(([category, minor], index) => {
      const percent = (minor / total) * 100;
      return {
        category,
        color: this.CHART_COLORS[index % this.CHART_COLORS.length],
        amount: minor / (10 ** minorUnits),
        percentLabel: percent < 0.1 ? '<0.1%' : `${percent.toFixed(1)}%`,
      };
    });

    const data: ChartData<'doughnut'> = {
      labels: entries.map(([category]) => category),
      datasets: [
        {
          data: entries.map(([, minor]) => minor / (10 ** minorUnits)),
          backgroundColor: slices.map((s) => s.color),
          borderColor: '#ffffff',
          borderWidth: 1,
          hoverOffset: 4,
        },
      ],
    };

    const options: ChartOptions<'doughnut'> = {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '70%',
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

    return { slices, total: total / (10 ** minorUnits), currency: this.baseCurrency, data, options };
  }
}