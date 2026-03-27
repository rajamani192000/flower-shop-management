import { AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject, combineLatest } from 'rxjs';
import { map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import { ReferenceDataService } from '../../../services/reference-data.service';
import { PrintService } from '../../../services/print.service';
import { ShopProfileService, ShopProfileView } from '../../../services/shop-profile.service';
import { todayIsoDate } from '../../../shared/utils/finance.utils';

@Component({
  selector: 'app-sales-page',
  templateUrl: './sales-page.component.html',
  styleUrls: ['./sales-page.component.scss']
})
export class SalesPageComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  isSaving = false;
  isLoading = true;
  autoPrint = localStorage.getItem('flower_auto_print') !== 'false';
  shopProfile: ShopProfileView | null = null;
  paymentTypes = ['Cash', 'UPI', 'Credit'];

  flowers: any[] = [];
  customers: any[] = [];
  purchases: any[] = [];
  salesDataSource = new MatTableDataSource<any>([]);
  displayedColumns = ['date', 'flowerName', 'customerName', 'weight', 'totalAmount', 'paymentType', 'actions'];

  form = this.fb.group({
    flowerId: ['', Validators.required],
    customerId: [''],
    weight: [1, [Validators.required, Validators.min(0.01)]],
    unitPrice: [0, [Validators.required, Validators.min(0.01)]],
    totalAmount: [{ value: 0, disabled: true }, Validators.required],
    paymentType: ['Cash', Validators.required],
    date: [todayIsoDate(), Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private snackBar: MatSnackBar,
    private referenceData: ReferenceDataService,
    private printService: PrintService,
    private shopProfileService: ShopProfileService
  ) {}

  ngOnInit(): void {
    this.salesDataSource.filterPredicate = (data, filter) => {
      const source = `${data.date} ${data.flowerName} ${data.customerName} ${data.paymentType}`.toLowerCase();
      return source.includes(filter);
    };

    this.api.refresh$
      .pipe(
        startWith(void 0),
        switchMap(() => combineLatest([this.api.getFlowers(), this.api.getCustomers(), this.api.getSales(), this.api.getPurchases()])),
        switchMap(([flowers, customers, sales, purchases]) =>
          this.referenceData.resolveSales(
            [...sales].sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
          ).pipe(map((resolvedSales) => ({ flowers, customers, purchases, resolvedSales })))
        ),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: ({ flowers, customers, purchases, resolvedSales }) => {
          this.flowers = flowers;
          this.customers = customers;
          this.purchases = purchases;
          this.salesDataSource.data = resolvedSales;
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open(error?.message || 'Failed to load sales data', 'Close', { duration: 2500 });
        }
      });

    this.shopProfileService.profile$.pipe(takeUntil(this.destroy$)).subscribe((profile) => {
      this.shopProfile = profile;
      this.autoPrint = localStorage.getItem('flower_auto_print') === 'true';
    });

    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      const qty = Number(this.form.get('weight')?.value || 0);
      const price = Number(this.form.get('unitPrice')?.value || 0);
      const total = qty * price;
      this.form.get('totalAmount')?.setValue(total, { emitEvent: false });
    });

    this.form.get('flowerId')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((flowerId) => {
      const selectedFlower = this.flowers.find((row) => String(row.id || row.flowerId) === String(flowerId || ''));
      if (!selectedFlower) {
        return;
      }
      const purchaseRows = this.purchasesForFlower(String(flowerId));
      const latestPrice = purchaseRows.length > 0 ? Number(purchaseRows[0].unitPrice || purchaseRows[0].price || 0) : 0;
      const fallbackDefault = Number(selectedFlower.defaultPrice || 0);
      const nextPrice = latestPrice > 0 ? latestPrice : fallbackDefault;
      if (nextPrice > 0) {
        this.form.get('unitPrice')?.setValue(nextPrice);
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.salesDataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.salesDataSource.sort = this.sort;
    }
  }

  applyFilter(value: string): void {
    this.salesDataSource.filter = value.trim().toLowerCase();
  }

  toggleAutoPrint(value: boolean): void {
    this.autoPrint = value;
    localStorage.setItem('flower_auto_print', String(value));
  }

  @HostListener('document:keydown.control.s', ['$event'])
  onCtrlSave(event: KeyboardEvent): void {
    event.preventDefault();
    void this.save();
  }

  @HostListener('document:keydown.enter', ['$event'])
  onEnterSave(event: KeyboardEvent): void {
    const target = event.target as HTMLElement | null;
    const tag = target?.tagName?.toLowerCase();
    if (tag === 'textarea' || (target as HTMLInputElement | null)?.type === 'date') {
      return;
    }
    if (!this.isSaving) {
      event.preventDefault();
      void this.save();
    }
  }

  async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    try {
      const payload = {
        ...this.form.getRawValue(),
        weight: Number(this.form.get('weight')?.value || 0),
        unitPrice: Number(this.form.get('unitPrice')?.value || 0),
        totalAmount: Number(this.form.get('totalAmount')?.value || 0)
      };

      const savedSale = await firstValueFrom(this.api.createSale(payload));

      if (this.autoPrint) {
        const flower = this.flowers.find((row) => String(row.id || row.flowerId) === String(payload.flowerId));
        const customer = this.customers.find((row) => String(row.id) === String(payload.customerId));
        this.printService.printSaleReceipt({
          shopName: this.shopProfile?.shopName,
          shopAddress: this.shopProfile?.address,
          shopPhone: this.shopProfile?.phone,
          gstNumber: this.shopProfile?.gstNumber,
          saleNo: String(savedSale?.id || Date.now()),
          date: String(payload.date),
          customerName: customer?.name || 'Walk-in',
          paymentType: String(payload.paymentType),
          grandTotal: Number(payload.totalAmount),
          items: [
            {
              name: flower?.flowerName || 'Flower',
              qty: Number(payload.weight),
              price: Number(payload.unitPrice),
              total: Number(payload.totalAmount)
            }
          ]
        });
      }

      this.form.patchValue({
        customerId: '',
        weight: 1,
        unitPrice: 0,
        totalAmount: 0,
        paymentType: 'Cash',
        date: todayIsoDate()
      });
    } catch (error: any) {
      this.snackBar.open(error?.message || 'Sale save failed', 'Close', { duration: 3000 });
    } finally {
      this.isSaving = false;
    }
  }

  trackById(_: number, row: any): string {
    return String(row?.id || row?.date || _);
  }

  printRow(row: any): void {
    this.printService.printSaleReceipt({
      shopName: this.shopProfile?.shopName,
      shopAddress: this.shopProfile?.address,
      shopPhone: this.shopProfile?.phone,
      gstNumber: this.shopProfile?.gstNumber,
      saleNo: String(row.id || '-'),
      date: String(row.date || ''),
      customerName: String(row.customerName || 'Walk-in'),
      paymentType: String(row.paymentType || ''),
      grandTotal: Number(row.totalAmount || row.price || 0),
      items: [
        {
          name: String(row.flowerName || ''),
          qty: Number(row.weight || 0),
          price: Number(row.unitPrice || 0),
          total: Number(row.totalAmount || row.price || 0)
        }
      ]
    });
  }

  private purchasesForFlower(flowerId: string): any[] {
    const rows = this.purchases || [];
    return rows.filter((row) => String(row.flowerId || '') === flowerId);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
