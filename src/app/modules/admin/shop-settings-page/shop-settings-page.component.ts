import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { FirestoreSeederService } from '../../../services/firestore-seeder.service';
import { ApiService } from '../../../services/api.service';
import { ShopContextService } from '../../../shop-context.service';

@Component({
  selector: 'app-shop-settings-page',
  templateUrl: './shop-settings-page.component.html',
  styleUrls: ['./shop-settings-page.component.scss']
})
export class ShopSettingsPageComponent implements OnInit {
  isInitializing = false;
  isSaving = false;
  settingDocId: string | null = null;

  form = this.fb.group({
    shopName: ['', Validators.required],
    shopCode: [''],
    address: [''],
    phone: [''],
    logoUrl: [''],
    gstNumber: [''],
    currency: ['INR', Validators.required],
    taxEnabled: [false],
    lowStockAlert: [true],
    lowStockThreshold: [10, [Validators.required, Validators.min(0)]],
    highCreditThreshold: [5000, [Validators.required, Validators.min(0)]],
    autoPrint: [false],
    printerPaperSize: ['80mm'],
    printerType: ['thermal'],
    theme: ['default']
  });

  constructor(
    private fb: FormBuilder,
    private seeder: FirestoreSeederService,
    private shopContext: ShopContextService,
    private api: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    void this.loadSettings();
  }

  async loadSettings(): Promise<void> {
    try {
      const rows = await firstValueFrom(this.api.getCollection<any>('settings'));
      if (rows.length > 0) {
        const current = rows[0];
        this.settingDocId = current.id;
        this.form.patchValue({
          shopName: current.shopName || '',
          shopCode: current.shopCode || '',
          address: current.address || '',
          phone: current.phone || '',
          logoUrl: current.logoUrl || '',
          gstNumber: current.gstNumber || '',
          currency: current.currency || 'INR',
          taxEnabled: Boolean(current.taxEnabled),
          lowStockAlert: current.lowStockAlert ?? true,
          lowStockThreshold: Number(current.lowStockThreshold ?? 10),
          highCreditThreshold: Number(current.highCreditThreshold ?? 5000),
          autoPrint: Boolean(current.autoPrint),
          printerPaperSize: current.printerPaperSize || '80mm',
          printerType: current.printerType || 'thermal',
          theme: current.theme || 'default'
        });
      }
    } catch (error: any) {
      this.snackBar.open(error?.message || 'Failed to load shop settings', 'Close', { duration: 2500 });
    }
  }

  async saveSettings(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isSaving = true;
    try {
      const payload = this.form.getRawValue();
      if (this.settingDocId) {
        await firstValueFrom(this.api.updateRecord('settings', this.settingDocId, payload));
      } else {
        const saved = await firstValueFrom(this.api.createRecord('settings', payload));
        this.settingDocId = saved?.id || null;
      }
    } catch (error: any) {
      this.snackBar.open(error?.message || 'Failed to save settings', 'Close', { duration: 2500 });
    } finally {
      this.isSaving = false;
    }
  }

  async initializeDatabase(): Promise<void> {
    const shopId = this.shopContext.currentShopId;
    if (!shopId) {
      this.snackBar.open('Shop context missing', 'Close', { duration: 2000 });
      return;
    }
    this.isInitializing = true;
    try {
      await this.seeder.initializeShop(shopId);
      await this.loadSettings();
    } catch (error: any) {
      this.snackBar.open(error?.message || 'General error message', 'Close', { duration: 2500 });
    } finally {
      this.isInitializing = false;
    }
  }
}
