import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private api: ApiService) {}

  getDashboardOverview(period: string = 'today', from?: string, to?: string): Observable<any> {
    return this.api.getDashboard(period, from, to).pipe(
      catchError(() =>
        of({
          salesToday: 0,
          purchaseToday: 0,
          expenseToday: 0,
          profitToday: 0,
          stockValue: 0,
          topSellingFlowers: [],
          lowStock: [],
          recentSales: []
        })
      )
    );
  }
}
