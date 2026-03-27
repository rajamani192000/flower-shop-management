import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { InventoryService } from '../../../services/inventory.service';
import { ReferenceDataService } from '../../../services/reference-data.service';

@Component({
  selector: 'app-stock-status-page',
  templateUrl: './stock-status-page.component.html',
  styleUrls: ['./stock-status-page.component.scss']
})
export class StockStatusPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;
  private readonly destroy$ = new Subject<void>();

  isLoading = true;
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns = ['flower', 'opening', 'purchase', 'sales', 'waste', 'current'];

  constructor(
    private inventoryService: InventoryService,
    private referenceData: ReferenceDataService
  ) {
    this.dataSource.filterPredicate = (data, filter) =>
      `${data.flowerName} ${data.currentStock} ${data.purchases} ${data.sales}`.toLowerCase().includes(filter);
  }

  ngOnInit(): void {
    this.inventoryService
      .getStockStatus()
      .pipe(
        switchMap((rows) => this.referenceData.resolveStock(rows)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (resolvedRows) => {
          this.dataSource.data = resolvedRows;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.dataSource.data = [];
        }
      });
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

