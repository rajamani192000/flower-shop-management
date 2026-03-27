import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { ShopContextService } from '../shop-context.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreShopService {
  constructor(
    private api: ApiService,
    private shopContext: ShopContextService
  ) {}

  watchCollection<T>(collectionName: string): Observable<(T & { id: string })[]> {
    return this.api.refresh$.pipe(
      startWith(void 0),
      switchMap(() => this.api.getCollection<T & { id: string }>(collectionName))
    );
  }

  async add<T>(collectionName: string, payload: T): Promise<void> {
    const shopId = this.shopContext.currentShopId;
    if (!shopId) {
      throw new Error('Shop context not loaded.');
    }

    await firstValueFrom(this.api.createRecord(collectionName, payload));
  }

  async update<T extends { id: string }>(collectionName: string, payload: T): Promise<void> {
    const { id, ...data } = payload;
    await firstValueFrom(this.api.updateRecord(collectionName, id, data));
  }

  async delete(collectionName: string, id: string): Promise<void> {
    await firstValueFrom(this.api.deleteRecord(collectionName, id));
  }
}
