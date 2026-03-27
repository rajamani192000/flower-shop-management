import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, combineLatest, firstValueFrom } from 'rxjs';
import { map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { ApiService } from '../../../services/api.service';
import { StorageService } from '../../../services/storage.service';
import { ShopContextService } from '../../../shop-context.service';
import { ReferenceDataService } from '../../../services/reference-data.service';
import { PrintService } from '../../../services/print.service';
import { ShopProfileService, ShopProfileView } from '../../../services/shop-profile.service';
import { todayIsoDate } from '../../../shared/utils/finance.utils';

@Component({
  selector: 'app-purchases-page',
  templateUrl: './purchases-page.component.html',
  styleUrls: ['./purchases-page.component.scss']
})
export class PurchasesPageComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  paymentTypes = ['Cash', 'UPI', 'Credit'];
  isSaving = false;
  isLoading = true;
  selectedFile: File | null = null;
  billItems: Array<{ flowerId: string; flowerName: string; weight: number; unitPrice: number; totalAmount: number }> = [];
  shopProfile: ShopProfileView | null = null;

  flowers: any[] = [];
  suppliers: any[] = [];
  purchasesDataSource = new MatTableDataSource<any>([]);
  displayedColumns = ['date', 'billNo', 'flowerName', 'supplierName', 'weight', 'totalAmount', 'paymentType', 'actions'];

  billForm = this.fb.group({
    supplierId: ['', Validators.required],
    boxNumber: [''],
    paymentType: ['Cash', Validators.required],
    date: [todayIsoDate(), Validators.required]
  });

  itemForm = this.fb.group({
    flowerId: ['', Validators.required],
    weight: [1, [Validators.required, Validators.min(0.01)]],
    unitPrice: [0, [Validators.required, Validators.min(0.01)]],
    totalAmount: [{ value: 0, disabled: true }]
  });

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private api: ApiService,
    private storage: StorageService,
    private shopContext: ShopContextService,
    private referenceData: ReferenceDataService,
    private printService: PrintService,
    private shopProfileService: ShopProfileService
  ) {}

  ngOnInit(): void {
    this.purchasesDataSource.filterPredicate = (data, filter) => {
      const source = `${data.date} ${data.flowerName} ${data.supplierName} ${data.paymentType} ${data.billNo || ''}`.toLowerCase();
      return source.includes(filter);
    };

    this.api.refresh$
      .pipe(
        startWith(void 0),
        switchMap(() => combineLatest([this.api.getFlowers(), this.api.getSuppliers(), this.api.getPurchases()])),
        switchMap(([flowers, suppliers, purchases]) =>
          this.referenceData.resolvePurchases(
            [...purchases].sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
          ).pipe(map((resolvedPurchases) => ({ flowers, suppliers, resolvedPurchases })))
        ),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: ({ flowers, suppliers, resolvedPurchases }) => {
          this.flowers = flowers;
          this.suppliers = suppliers;
          this.purchasesDataSource.data = resolvedPurchases;
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open(error?.message || 'Failed to load purchases', 'Close', { duration: 2500 });
        }
      });

    this.itemForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      const qty = Number(this.itemForm.get('weight')?.value || 0);
      const price = Number(this.itemForm.get('unitPrice')?.value || 0);
      this.itemForm.get('totalAmount')?.setValue(qty * price, { emitEvent: false });
    });

    this.itemForm.get('flowerId')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((flowerId) => {
      const selectedFlower = this.flowers.find((row) => String(row.id || row.flowerId) === String(flowerId || ''));
      if (selectedFlower && Number(selectedFlower.defaultPrice || 0) > 0) {
        this.itemForm.get('unitPrice')?.setValue(Number(selectedFlower.defaultPrice));
      }
    });

    this.shopProfileService.profile$.pipe(takeUntil(this.destroy$)).subscribe((profile) => {
      this.shopProfile = profile;
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
  }

  addItem(): void {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }
    const flowerId = String(this.itemForm.get('flowerId')?.value || '');
    const flower = this.flowers.find((row) => String(row.id || row.flowerId) === flowerId);
    const weight = Number(this.itemForm.get('weight')?.value || 0);
    const unitPrice = Number(this.itemForm.get('unitPrice')?.value || 0);
    const totalAmount = Number(this.itemForm.get('totalAmount')?.value || 0);

    this.billItems.push({
      flowerId,
      flowerName: flower?.flowerName || 'Flower',
      weight,
      unitPrice,
      totalAmount
    });

    this.itemForm.patchValue({
      flowerId: '',
      weight: 1,
      unitPrice: 0,
      totalAmount: 0
    });
  }

  removeItem(index: number): void {
    this.billItems.splice(index, 1);
  }

  get billTotal(): number {
    return this.billItems.reduce((sum, item) => sum + Number(item.totalAmount || 0), 0);
  }

  async save(): Promise<void> {
    if (this.billForm.invalid || this.billItems.length === 0) {
      this.billForm.markAllAsTouched();
      if (this.billItems.length === 0) {
        this.snackBar.open('Add at least one flower item', 'Close', { duration: 2500 });
      }
      return;
    }

    this.isSaving = true;
    try {
      let billPhotoUrl = '';
      const shopId = this.shopContext.currentShopId;
      if (shopId && this.selectedFile) {
        billPhotoUrl = await this.storage.uploadPurchaseBill(this.selectedFile, shopId);
      }

      const payload = {
        ...this.billForm.getRawValue(),
        billPhotoUrl,
        items: this.billItems.map((item) => ({
          flowerId: item.flowerId,
          weight: item.weight,
          unitPrice: item.unitPrice,
          totalAmount: item.totalAmount
        }))
      };

      await firstValueFrom(this.api.createPurchase(payload));

      this.printService.printTable('Purchase Bill', ['Flower', 'Qty', 'Unit Price', 'Total'], this.billItems.map((item) => [
        item.flowerName,
        item.weight,
        item.unitPrice.toFixed(2),
        item.totalAmount.toFixed(2)
      ]));

      this.billItems = [];
      this.billForm.patchValue({
        boxNumber: '',
        paymentType: 'Cash',
        date: todayIsoDate()
      });
      this.selectedFile = null;
    } catch (error: any) {
      this.snackBar.open(error?.message || 'Purchase save failed', 'Close', { duration: 3000 });
    } finally {
      this.isSaving = false;
    }
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.purchasesDataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.purchasesDataSource.sort = this.sort;
    }
  }

  applyFilter(value: string): void {
    this.purchasesDataSource.filter = value.trim().toLowerCase();
  }

  printRow(row: any): void {
    this.printService.printTable('Purchase Receipt', ['Date', 'Bill', 'Flower', 'Supplier', 'Qty', 'Total'], [[
      String(row.date || ''),
      String(row.billNo || row.id || ''),
      String(row.flowerName || ''),
      String(row.supplierName || ''),
      Number(row.weight || 0),
      Number(row.totalAmount || row.price || 0).toFixed(2)
    ]]);
  }

  trackById(_: number, row: any): string {
    return String(row?.id || row?.date || _);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
