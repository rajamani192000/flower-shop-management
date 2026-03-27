import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject, firstValueFrom } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../services/api.service';
import { PrintService } from '../../../services/print.service';
import { ShopProfileService, ShopProfileView } from '../../../services/shop-profile.service';
import { todayIsoDate } from '../../../shared/utils/finance.utils';

@Component({
  selector: 'app-credit-collection-page',
  templateUrl: './credit-collection-page.component.html',
  styleUrls: ['./credit-collection-page.component.scss']
})
export class CreditCollectionPageComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  customers: any[] = [];
  pendingRows: any[] = [];
  shopProfile: ShopProfileView | null = null;
  isSaving = false;

  form = this.fb.group({
    customerId: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(1)]],
    date: [todayIsoDate(), Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private snackBar: MatSnackBar,
    private printService: PrintService,
    private shopProfileService: ShopProfileService
  ) {}

  ngOnInit(): void {
    this.api.getCreditCustomerSummaries().pipe(takeUntil(this.destroy$)).subscribe((rows) => {
      this.customers = rows;
    });

    this.form.get('customerId')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((customerId) => {
      if (!customerId) {
        this.pendingRows = [];
        return;
      }
      this.api.getPendingCreditsByCustomer(String(customerId)).subscribe((rows) => {
        this.pendingRows = rows;
      });
    });

    this.shopProfileService.profile$.pipe(takeUntil(this.destroy$)).subscribe((profile) => {
      this.shopProfile = profile;
    });
  }

  customerLabel(customer: any): string {
    return `${customer.name} • Pending: ₹${Number(customer.pendingAmount || 0).toFixed(2)} • Last: ${customer.lastPurchaseDate || '-'}`;
  }

  async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isSaving = true;
    try {
      const payload = this.form.getRawValue();
      await firstValueFrom(this.api.createRecord('creditCollections', payload));
      const selectedCustomer = this.customers.find((row) => row.id === payload.customerId);
      this.printService.printTable(
        'Credit Collection Receipt',
        ['Customer', 'Date', 'Paid Amount', 'Pending Bills'],
        [[
          selectedCustomer?.name || '-',
          String(payload.date || ''),
          Number(payload.amount || 0).toFixed(2),
          String(this.pendingRows.length)
        ]]
      );
      this.form.patchValue({ amount: 0, date: todayIsoDate() });
      this.pendingRows = await firstValueFrom(this.api.getPendingCreditsByCustomer(String(payload.customerId || '')));
    } catch (error: any) {
      this.snackBar.open(error?.message || 'Failed to collect credit', 'Close', { duration: 2500 });
    } finally {
      this.isSaving = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

