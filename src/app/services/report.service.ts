import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { COLLECTIONS } from '../shared/utils/app.constants';
import { FirestoreShopService } from './firestore-shop.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor(private shopDb: FirestoreShopService) {}

  wastePercentage$() {
    return this.shopDb.watchCollection<any>(COLLECTIONS.sorting).pipe(
      map((rows) => {
        const gross = rows.reduce((sum, row) => sum + Number(row.grossWeight || 0), 0);
        const waste = rows.reduce((sum, row) => sum + Number(row.wasteWeight || 0), 0);
        return gross > 0 ? Number(((waste / gross) * 100).toFixed(2)) : 0;
      })
    );
  }

  topSellingFlowers$() {
    return this.shopDb.watchCollection<any>(COLLECTIONS.sales).pipe(
      map((rows) => {
        const grouped: Record<string, number> = {};
        rows.forEach((row) => {
          const key = row.flowerId || 'Unknown';
          grouped[key] = (grouped[key] || 0) + Number(row.weight || 0);
        });
        return Object.entries(grouped)
          .map(([flowerId, totalWeight]) => ({ flowerId, totalWeight }))
          .sort((a, b) => b.totalWeight - a.totalWeight)
          .slice(0, 5);
      })
    );
  }
}
