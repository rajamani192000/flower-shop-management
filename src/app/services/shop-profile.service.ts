import { Injectable } from '@angular/core';
import { Observable, combineLatest, of } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';

export interface ShopProfileView {
  userName: string;
  email: string;
  role: string;
  shopName: string;
  shopCode: string;
  shopId: string;
  phone: string;
  address: string;
  gstNumber: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShopProfileService {
  readonly profile$ = combineLatest([
    this.auth.userProfile$(),
    this.api.refresh$.pipe(
      switchMap(() => this.api.getCollection<any>('settings')),
      map((rows) => rows[0] || null)
    )
  ]).pipe(
    map(([user, settings]) => {
      const fallbackShopId = user?.shopId || '';
      const fallbackCode = user?.shopCode || `SHOP-${fallbackShopId.slice(0, 6).toUpperCase()}`;
      return {
        userName: user?.name || '',
        email: user?.email || '',
        role: user?.role || '',
        shopName: settings?.shopName || user?.shopName || 'Flower Shop',
        shopCode: settings?.shopCode || fallbackCode,
        shopId: fallbackShopId,
        phone: settings?.phone || '',
        address: settings?.address || '',
        gstNumber: settings?.gstNumber || ''
      } as ShopProfileView;
    }),
    shareReplay(1)
  );

  constructor(
    private auth: AuthService,
    private api: ApiService
  ) {
    this.api.triggerRefresh();
  }
}

