import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ApiService } from './api.service';

type NamedRecord = { id: string; [key: string]: any };

@Injectable({
  providedIn: 'root'
})
export class ReferenceDataService {
  private readonly flowers$ = this.api.getFlowers().pipe(shareReplay(1));
  private readonly customers$ = this.api.getCustomers().pipe(shareReplay(1));
  private readonly suppliers$ = this.api.getSuppliers().pipe(shareReplay(1));

  private readonly lookups$ = combineLatest([this.flowers$, this.customers$, this.suppliers$]).pipe(
    map(([flowers, customers, suppliers]) => ({
      flowersById: this.toMap(flowers, 'flowerName'),
      customersById: this.toMap(customers, 'name'),
      suppliersById: this.toMap(suppliers, 'supplierName')
    })),
    shareReplay(1)
  );

  constructor(private api: ApiService) {}

  resolveSales<T extends { flowerId?: string; customerId?: string }>(rows: T[]): Observable<Array<T & {
    flowerName: string;
    customerName: string;
  }>> {
    return this.lookups$.pipe(
      map((lookup) =>
        rows.map((row) => ({
          ...row,
          flowerName: lookup.flowersById.get(String(row.flowerId || '')) || 'Unknown Flower',
          customerName: row.customerId
            ? lookup.customersById.get(String(row.customerId)) || 'Unknown Customer'
            : 'Walk-in'
        }))
      )
    );
  }

  resolvePurchases<T extends { flowerId?: string; supplierId?: string }>(rows: T[]): Observable<Array<T & {
    flowerName: string;
    supplierName: string;
  }>> {
    return this.lookups$.pipe(
      map((lookup) =>
        rows.map((row) => ({
          ...row,
          flowerName: lookup.flowersById.get(String(row.flowerId || '')) || 'Unknown Flower',
          supplierName: lookup.suppliersById.get(String(row.supplierId || '')) || 'Unknown Supplier'
        }))
      )
    );
  }

  resolveStock<T extends { flowerId?: string }>(rows: T[]): Observable<Array<T & { flowerName: string }>> {
    return this.lookups$.pipe(
      map((lookup) =>
        rows.map((row) => ({
          ...row,
          flowerName: lookup.flowersById.get(String(row.flowerId || '')) || 'Unknown Flower'
        }))
      )
    );
  }

  getFlowerNameById(id?: string | null): Observable<string> {
    return this.lookups$.pipe(map((lookup) => lookup.flowersById.get(String(id || '')) || 'Unknown Flower'));
  }

  getSupplierNameById(id?: string | null): Observable<string> {
    return this.lookups$.pipe(map((lookup) => lookup.suppliersById.get(String(id || '')) || 'Unknown Supplier'));
  }

  getCustomerNameById(id?: string | null): Observable<string> {
    return this.lookups$.pipe(map((lookup) => lookup.customersById.get(String(id || '')) || 'Unknown Customer'));
  }

  private toMap(rows: NamedRecord[], nameKey: string): Map<string, string> {
    return new Map(
      rows.map((row) => [String(row.id || row[`${nameKey}Id`] || ''), String(row[nameKey] || row.id || '')])
    );
  }
}

