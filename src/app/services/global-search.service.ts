import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { ApiService } from './api.service';

export interface GlobalSearchItem {
  type: 'flower' | 'customer' | 'supplier' | 'sale' | 'purchase';
  id: string;
  label: string;
  subLabel?: string;
  route: string;
}

@Injectable({
  providedIn: 'root'
})
export class GlobalSearchService {
  private readonly query$ = new BehaviorSubject<string>('');

  readonly results$: Observable<GlobalSearchItem[]> = this.query$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    filter((query) => query.trim().length >= 2),
    switchMap((query) =>
      this.api.globalSearch(query).pipe(
        catchError(() => of([]))
      )
    )
  );

  constructor(private api: ApiService) {}

  search(query: string): void {
    this.query$.next(query);
  }
}

