import { Component } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent {
  filter = 'Today';
  customFrom = '';
  customTo = '';
  private readonly filter$ = new BehaviorSubject<string>('today');
  overview$ = this.filter$.pipe(
    switchMap((period) => this.dashboardService.getDashboardOverview(period, this.customFrom, this.customTo))
  );

  quickActions = [
    { label: 'Sale', route: '/sales' },
    { label: 'Purchase', route: '/purchases' },
    { label: 'Expense', route: '/expenses' },
    { label: 'Waste', route: '/waste' }
  ];

  constructor(private dashboardService: DashboardService) {}

  onFilterChange(value: string): void {
    this.filter = value;
    this.filter$.next(value.toLowerCase());
  }

  applyCustomRange(): void {
    if (this.filter !== 'Custom') {
      return;
    }
    this.filter$.next('custom');
  }

  topSellingConfig(topSelling: { flowerName: string; totalWeight: number }[]): ChartConfiguration<'doughnut'>['data'] {
    return {
      labels: topSelling.map((x) => x.flowerName),
      datasets: [{ data: topSelling.map((x) => x.totalWeight), backgroundColor: ['#E91E63', '#F06292', '#81C784', '#4CAF50', '#AED581'] }]
    };
  }
}
