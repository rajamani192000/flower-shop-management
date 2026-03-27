import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject, combineLatest, firstValueFrom } from 'rxjs';
import { startWith, switchMap, takeUntil } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../../services/api.service';
import { todayIsoDate } from '../../../shared/utils/finance.utils';

@Component({
  selector: 'app-credit-sales-page',
  templateUrl: './credit-sales-page.component.html',
  styleUrls: ['./credit-sales-page.component.scss']
})
export class CreditSalesPageComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  customers: any[] = [];
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns = ['date', 'customerName', 'amount', 'status'];

  form = this.fb.group({
    customerId: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(1)]],
    date: [todayIsoDate(), Validators.required],
    status: ['Pending', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.api.refresh$
      .pipe(
        startWith(void 0),
        switchMap(() => combineLatest([this.api.getCreditCustomerSummaries(), this.api.getCollection<any>('creditSales')])),
        takeUntil(this.destroy$)
      )
      .subscribe(([customers, rows]) => {
        this.customers = customers;
        const byId = new Map(customers.map((c) => [c.id, c.name]));
        this.dataSource.data = rows.map((row) => ({
          ...row,
          customerName: byId.get(row.customerId) || 'Unknown Customer'
        }));
      });
  }

  async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    await firstValueFrom(this.api.createRecord('creditSales', this.form.getRawValue()));
    this.form.patchValue({ amount: 0, date: todayIsoDate(), status: 'Pending' });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

