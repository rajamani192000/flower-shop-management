import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopContextService {
  private readonly key = 'flower_shop_id';
  private readonly shopIdSubject = new BehaviorSubject<string | null>(localStorage.getItem(this.key));
  readonly shopId$ = this.shopIdSubject.asObservable();

  get currentShopId(): string | null {
    return this.shopIdSubject.value;
  }

  setShopId(shopId: string): void {
    localStorage.setItem(this.key, shopId);
    this.shopIdSubject.next(shopId);
  }

  clear(): void {
    localStorage.removeItem(this.key);
    this.shopIdSubject.next(null);
  }
}
