import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import type { GlobalSearchItem } from './global-search.service';

interface ApiEnvelope<T> {
  success?: boolean;
  data: T;
  message?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiBase = environment.apiBaseUrl;
  private readonly refreshSubject = new Subject<void>();
  readonly refresh$ = this.refreshSubject.asObservable();

  private readonly resourceMap: Record<string, string> = {
    flowers: 'flowers',
    customers: 'customers',
    suppliers: 'suppliers',
    units: 'units',
    expenseTypes: 'expense-types',
    wasteReasons: 'waste-reasons',
    flowerCategories: 'flower-categories',
    settings: 'settings',
    boxTracking: 'box-tracking',
    priceHistory: 'price-history',
    users: 'users',
    sorting: 'sorting',
    creditSales: 'credit-sales',
    creditCollections: 'credit-collections',
    stock: 'stock/status',
    sales: 'sales',
    purchases: 'purchases',
    expenses: 'expenses',
    waste: 'waste'
  };

  constructor(private http: HttpClient) {}

  triggerRefresh(): void {
    this.refreshSubject.next();
  }

  getDashboard(period: string = 'today', from?: string, to?: string): Observable<any> {
    const params: Record<string, string> = { period: period.toLowerCase() };
    if (from) {
      params['from'] = from;
    }
    if (to) {
      params['to'] = to;
    }
    return this.http.get<ApiEnvelope<any>>(`${this.apiBase}/dashboard/overview`, { params }).pipe(map((res) => res.data));
  }

  getFlowers(): Observable<any[]> {
    return this.http.get<ApiEnvelope<any[]>>(`${this.apiBase}/flowers`).pipe(map((res) => res.data || []));
  }

  getCustomers(): Observable<any[]> {
    return this.http.get<ApiEnvelope<any[]>>(`${this.apiBase}/customers`).pipe(map((res) => res.data || []));
  }

  getSuppliers(): Observable<any[]> {
    return this.http.get<ApiEnvelope<any[]>>(`${this.apiBase}/suppliers`).pipe(map((res) => res.data || []));
  }

  getSales(): Observable<any[]> {
    return this.http.get<ApiEnvelope<any[]>>(`${this.apiBase}/sales`).pipe(map((res) => res.data || []));
  }

  getPurchases(): Observable<any[]> {
    return this.http.get<ApiEnvelope<any[]>>(`${this.apiBase}/purchases`).pipe(map((res) => res.data || []));
  }

  createSale(payload: any): Observable<any> {
    return this.http.post<ApiEnvelope<any>>(`${this.apiBase}/sales`, payload).pipe(
      tap(() => this.triggerRefresh()),
      map((res) => res.data)
    );
  }

  createPurchase(payload: any): Observable<any> {
    return this.http.post<ApiEnvelope<any>>(`${this.apiBase}/purchases`, payload).pipe(
      tap(() => this.triggerRefresh()),
      map((res) => res.data)
    );
  }

  createExpense(payload: any): Observable<any> {
    return this.http.post<ApiEnvelope<any>>(`${this.apiBase}/expenses`, payload).pipe(
      tap(() => this.triggerRefresh()),
      map((res) => res.data)
    );
  }

  createWaste(payload: any): Observable<any> {
    return this.http.post<ApiEnvelope<any>>(`${this.apiBase}/waste`, payload).pipe(
      tap(() => this.triggerRefresh()),
      map((res) => res.data)
    );
  }

  getCollection<T>(collection: string): Observable<T[]> {
    const resource = this.getResourcePath(collection);
    return this.http.get<ApiEnvelope<T[]>>(`${this.apiBase}/${resource}`).pipe(map((res) => res.data || []));
  }

  createRecord(collection: string, data: any): Observable<any> {
    const resource = this.getResourcePath(collection);
    return this.http.post<ApiEnvelope<any>>(`${this.apiBase}/${resource}`, data).pipe(
      tap(() => this.triggerRefresh()),
      map((res) => res.data)
    );
  }

  updateRecord(collection: string, id: string, data: any): Observable<any> {
    const resource = this.getResourcePath(collection);
    return this.http.put<ApiEnvelope<any>>(`${this.apiBase}/${resource}/${id}`, data).pipe(
      tap(() => this.triggerRefresh()),
      map((res) => res.data)
    );
  }

  deleteRecord(collection: string, id: string): Observable<void> {
    const resource = this.getResourcePath(collection);
    return this.http.delete<ApiEnvelope<unknown>>(`${this.apiBase}/${resource}/${id}`).pipe(
      tap(() => this.triggerRefresh()),
      map(() => void 0)
    );
  }

  initializeDatabase(shopId: string): Observable<any> {
    return this.http.post<ApiEnvelope<any>>(`${this.apiBase}/admin/initialize`, { shopId }).pipe(map((res) => res.data));
  }

  getOutstandingCredits(): Observable<any> {
    return this.http.get<ApiEnvelope<any>>(`${this.apiBase}/credit/outstanding`).pipe(map((res) => res.data));
  }

  getCreditCustomerSummaries(): Observable<any[]> {
    return this.http.get<ApiEnvelope<any[]>>(`${this.apiBase}/credit/customers`).pipe(map((res) => res.data || []));
  }

  getPendingCreditsByCustomer(customerId: string): Observable<any[]> {
    return this.http.get<ApiEnvelope<any[]>>(`${this.apiBase}/credit/pending/${customerId}`).pipe(map((res) => res.data || []));
  }

  globalSearch(query: string): Observable<GlobalSearchItem[]> {
    return this.http
      .get<ApiEnvelope<GlobalSearchItem[]>>(`${this.apiBase}/dashboard/search`, {
        params: { query: query.trim() }
      })
      .pipe(map((res) => res.data || []));
  }

  private getResourcePath(collection: string): string {
    const resource = this.resourceMap[collection];
    if (!resource) {
      throw new Error(`No API resource mapping found for collection: ${collection}`);
    }
    return resource;
  }
}
