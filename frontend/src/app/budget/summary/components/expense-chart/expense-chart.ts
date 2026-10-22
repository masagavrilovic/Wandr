import { Component, inject, Input, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { BaseChartDirective } from 'ng2-charts';
import { ArcElement, Chart, ChartData, ChartOptions, DoughnutController, Tooltip } from 'chart.js';
import { filter, map, Observable } from 'rxjs';
import { ExpenseCategory } from '../../../expenses/expenses.models';
import { BudgetService } from '../../../budget.service';
import { SpendingByCategory } from '../../summary.models';
import { LoadSpendingActions } from '../../store/summary.actions';
import { selectSpendingByCategory } from '../../store/summary.selectors';

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
    this.view$ = this.store.select(selectSpendingByCategory).pipe(
      filter((s): s is SpendingByCategory => s !== null),
      map((summary) => this.buildView(summary)),
    );
  }
  
   private buildView(summary: SpendingByCategory): ChartView {
    const categories = summary.categories.filter((c) => c.total > 0);

    const slices: ChartSlice[] = categories.map((c, index) => ({
      category: c.category,
      color: this.CHART_COLORS[index % this.CHART_COLORS.length],
      amount: c.total,
      percentLabel: c.percentage < 0.1 ? '<0.1%' : `${c.percentage.toFixed(1)}%`,
    }));

    const data: ChartData<'doughnut'> = {
      labels: slices.map((s) => s.category),
      datasets: [
        {
          data: slices.map((s) => s.amount),
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

    return { slices, total: summary.totalSpent, currency: summary.currency, data, options };
  }
}