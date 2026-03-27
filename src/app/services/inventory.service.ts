import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  constructor(private api: ApiService) {}

  getStockStatus(): Observable<any[]> {
    return this.api.refresh$.pipe(
      startWith(void 0),
      switchMap(() => this.api.getCollection<any>('stock')),
      map((rows) => rows || [])
    );
  }
}
