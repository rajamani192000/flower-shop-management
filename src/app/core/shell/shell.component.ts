import { Component } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormControl } from '@angular/forms';
import { map, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { GlobalSearchItem, GlobalSearchService } from '../../services/global-search.service';
import { ShopProfileService } from '../../services/shop-profile.service';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent {
  readonly isMobile$ = this.breakpoint.observe('(max-width: 768px)').pipe(map((state) => state.matches));
  sidebarCollapsed = false;
  navSearchControl = new FormControl('', { nonNullable: true });
  topSearchControl = new FormControl('', { nonNullable: true });
  searchResults$: Observable<GlobalSearchItem[]> = of([]);
  shopProfile$ = this.shopProfile.profile$;
  readonly navGroups = [
    {
      title: 'Core',
      items: [{ label: 'Dashboard', icon: 'space_dashboard', route: '/dashboard' }]
    },
    {
      title: 'Transactions',
      items: [
        { label: 'Sales', icon: 'point_of_sale', route: '/sales' },
        { label: 'Purchases', icon: 'shopping_bag', route: '/purchases' },
        { label: 'Sorting', icon: 'sort', route: '/sorting' },
        { label: 'Waste', icon: 'delete_sweep', route: '/waste' },
        { label: 'Expenses', icon: 'payments', route: '/expenses' },
        { label: 'Credit Sales', icon: 'credit_score', route: '/sales/credit-sales' },
        { label: 'Credit Collection', icon: 'payments', route: '/sales/credit-collection' }
      ]
    },
    {
      title: 'Inventory',
      items: [
        { label: 'Stock Status', icon: 'inventory_2', route: '/inventory/stock-status' },
        { label: 'Box Tracking', icon: 'inventory', route: '/inventory/box-tracking' }
      ]
    },
    {
      title: 'Reports',
      items: [
        { label: 'Daily Report', icon: 'today', route: '/reports/daily' },
        { label: 'Weekly Report', icon: 'date_range', route: '/reports/weekly' },
        { label: 'Monthly Report', icon: 'calendar_month', route: '/reports/monthly' },
        { label: 'Profit Analysis', icon: 'trending_up', route: '/reports/profit-analysis' },
        { label: 'Waste Analysis', icon: 'analytics', route: '/reports/waste-analysis' }
      ]
    },
    {
      title: 'Masters',
      items: [
        { label: 'Flower Master', icon: 'local_florist', route: '/masters/flowers' },
        { label: 'Customer Master', icon: 'groups', route: '/masters/customers' },
        { label: 'Supplier Master', icon: 'storefront', route: '/masters/suppliers' },
        { label: 'Expense Type Master', icon: 'category', route: '/masters/expense-types' },
        { label: 'Unit Master', icon: 'straighten', route: '/masters/units' },
        { label: 'Waste Reason Master', icon: 'report_problem', route: '/masters/waste-reasons' }
      ]
    },
    {
      title: 'Finance',
      items: [
        { label: 'Cash Book', icon: 'menu_book', route: '/finance/cash-book' },
        { label: 'Price History', icon: 'show_chart', route: '/finance/price-history' }
      ]
    },
    {
      title: 'Admin',
      items: [
        { label: 'Staff Management', icon: 'manage_accounts', route: '/admin/staff-management' },
        { label: 'Database Setup', icon: 'database', route: '/admin/database-setup' },
        { label: 'Shop Settings', icon: 'settings', route: '/admin/shop-settings' }
      ]
    }
  ];

  readonly filteredNavGroups$ = this.navSearchControl.valueChanges.pipe(
    startWith(''),
    debounceTime(300),
    distinctUntilChanged(),
    map((query) => this.filterNavGroups(query))
  );

  constructor(
    private auth: AuthService,
    private router: Router,
    private breakpoint: BreakpointObserver,
    private globalSearch: GlobalSearchService,
    private shopProfile: ShopProfileService
  ) {}

  closeOnMobile(drawer: any, isMobile: boolean): void {
    if (isMobile) {
      void drawer.close();
    }
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  onGlobalSearchChange(query: string): void {
    if (query.trim().length < 2) {
      this.searchResults$ = of([]);
      return;
    }
    this.globalSearch.search(query);
    this.searchResults$ = this.globalSearch.results$;
  }

  async openResult(item: GlobalSearchItem): Promise<void> {
    this.topSearchControl.setValue('', { emitEvent: false });
    this.searchResults$ = of([]);
    await this.router.navigate([item.route]);
  }

  private filterNavGroups(query: string): Array<{ title: string; items: Array<{ label: string; icon: string; route: string }> }> {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return this.navGroups;
    }
    return this.navGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => item.label.toLowerCase().includes(normalized))
      }))
      .filter((group) => group.items.length > 0);
  }

  async logout(): Promise<void> {
    await this.auth.logout();
    await this.router.navigate(['/login']);
  }
}
