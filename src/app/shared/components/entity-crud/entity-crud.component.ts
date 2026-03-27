import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CrudField } from '../../models/crud.models';
import { FirestoreShopService } from '../../../services/firestore-shop.service';
import { PrintService } from '../../../services/print.service';

@Component({
  selector: 'app-entity-crud',
  templateUrl: './entity-crud.component.html',
  styleUrls: ['./entity-crud.component.scss']
})
export class EntityCrudComponent implements OnInit, OnDestroy {
  @Input({ required: true }) title = '';
  @Input({ required: true }) collection = '';
  @Input({ required: true }) fields: CrudField[] = [];
  @Input() defaults: Record<string, unknown> = {};
  @Input() useTwoColumns = false;

  records$ = this.shopDb.watchCollection<Record<string, unknown>>(this.collection);
  editingId: string | null = null;
  isSaving = false;
  isLoading = true;
  dataSource = new MatTableDataSource<Record<string, unknown>>([]);
  displayedColumns: string[] = [];
  private readonly destroy$ = new Subject<void>();

  form = this.fb.group({});

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private shopDb: FirestoreShopService,
    private printService: PrintService
  ) {}

  ngOnInit(): void {
    const controls: Record<string, any> = {};
    this.fields.forEach((field) => {
      const defaultValue = this.defaults[field.key] ?? '';
      controls[field.key] = field.required ? [defaultValue, Validators.required] : [defaultValue];
    });
    this.form = this.fb.group(controls);
    this.displayedColumns = [...this.fields.map((field) => field.key), 'actions'];
    this.dataSource.filterPredicate = (record, filter) =>
      this.fields.some((field) => String(record[field.key] ?? '').toLowerCase().includes(filter));
    this.records$ = this.shopDb.watchCollection<Record<string, unknown>>(this.collection);
    this.records$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (records) => {
        this.dataSource.data = records;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    try {
      const payload = this.form.getRawValue();
      if (this.editingId) {
        await this.shopDb.update(this.collection, { id: this.editingId, ...payload });
      } else {
        await this.shopDb.add(this.collection, payload);
      }
      this.cancelEdit();
    } catch (error: any) {
      this.snackBar.open(error?.message || 'Save failed', 'Close', { duration: 2500 });
    } finally {
      this.isSaving = false;
    }
  }

  edit(row: Record<string, any>): void {
    this.editingId = String(row['id']);
    this.form.patchValue(row);
  }

  async remove(id: string): Promise<void> {
    await this.shopDb.delete(this.collection, id);
  }

  cancelEdit(): void {
    this.editingId = null;
    this.form.reset(this.defaults);
  }

  applyFilter(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
  }

  trackByRecord(_: number, record: any): string {
    return String(record?.id || _);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  displayValue(record: Record<string, unknown>, key: string): string {
    const value = record[key];
    if (value === null || value === undefined || value === '') {
      return '-';
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return String(value);
  }

  printRow(record: Record<string, unknown>): void {
    const row = this.fields.map((field) => this.displayValue(record, field.key));
    this.printService.printTable(this.title, this.fields.map((field) => field.label), [row]);
  }

  printList(): void {
    const rows = this.dataSource.data.map((record) => this.fields.map((field) => this.displayValue(record, field.key)));
    this.printService.printTable(`${this.title} - List`, this.fields.map((field) => field.label), rows);
  }

}
