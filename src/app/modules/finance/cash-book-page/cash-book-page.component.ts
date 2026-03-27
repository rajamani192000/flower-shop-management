import { Component } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';
import { PrintService } from '../../../services/print.service';

@Component({
  selector: 'app-cash-book-page',
  templateUrl: './cash-book-page.component.html',
  styleUrls: ['./cash-book-page.component.scss']
})
export class CashBookPageComponent {
  stats$ = this.dashboardService.getDashboardOverview();

  constructor(
    private dashboardService: DashboardService,
    private printService: PrintService
  ) {}

  printCashbook(stats: any): void {
    this.printService.printTable('Cash Book', ['Metric', 'Amount'], [
      ['Cash Sales', Number(stats?.salesToday || 0).toFixed(2)],
      ['Purchases', Number(stats?.purchaseToday || 0).toFixed(2)],
      ['Expenses', Number(stats?.expenseToday || 0).toFixed(2)],
      ['Closing Cash', Number((stats?.salesToday || 0) - (stats?.purchaseToday || 0) - (stats?.expenseToday || 0)).toFixed(2)]
    ]);
  }
}
