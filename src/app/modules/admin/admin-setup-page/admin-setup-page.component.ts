import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FirestoreSeederService } from '../../../services/firestore-seeder.service';
import { ShopContextService } from '../../../shop-context.service';

@Component({
  selector: 'app-admin-setup-page',
  templateUrl: './admin-setup-page.component.html',
  styleUrls: ['./admin-setup-page.component.scss']
})
export class AdminSetupPageComponent {
  isInitializing = false;

  constructor(
    private seeder: FirestoreSeederService,
    private shopContext: ShopContextService,
    private snackBar: MatSnackBar
  ) {}

  async initializeDatabase(): Promise<void> {
    const shopId = this.shopContext.currentShopId;
    if (!shopId) {
      this.snackBar.open('General error message', 'Close', { duration: 2000 });
      return;
    }
    this.isInitializing = true;
    try {
      await this.seeder.initializeShop(shopId);
      this.snackBar.open('Database initialized successfully', 'OK', { duration: 2500 });
    } catch (error: any) {
      this.snackBar.open(error?.message || 'General error message', 'Close', { duration: 2500 });
    } finally {
      this.isInitializing = false;
    }
  }

}
