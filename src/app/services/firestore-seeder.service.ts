import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreSeederService {
  constructor(private api: ApiService) {}

  async initializeShop(shopId: string): Promise<void> {
    await firstValueFrom(this.api.initializeDatabase(shopId));
  }
}
