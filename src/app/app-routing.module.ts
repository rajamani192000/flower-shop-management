import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuard } from './core/guards/auth.service';
import { ShellComponent } from './core/shell/shell.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: ShellComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./modules/dashboard/dashboard.module').then((m) => m.DashboardModule)
      },
      {
        path: 'sales',
        loadChildren: () => import('./modules/sales/sales.module').then((m) => m.SalesModule)
      },
      {
        path: 'purchases',
        loadChildren: () => import('./modules/purchases/purchases.module').then((m) => m.PurchasesModule)
      },
      {
        path: 'sorting',
        loadChildren: () => import('./modules/sorting/sorting.module').then((m) => m.SortingModule)
      },
      {
        path: 'expenses',
        loadChildren: () => import('./modules/expenses/expenses.module').then((m) => m.ExpensesModule)
      },
      {
        path: 'waste',
        loadChildren: () => import('./modules/waste/waste.module').then((m) => m.WasteModule)
      },
      {
        path: 'inventory',
        loadChildren: () => import('./modules/inventory/inventory.module').then((m) => m.InventoryModule)
      },
      {
        path: 'reports',
        loadChildren: () => import('./modules/reports/reports.module').then((m) => m.ReportsModule)
      },
      {
        path: 'finance',
        loadChildren: () => import('./modules/finance/finance.module').then((m) => m.FinanceModule)
      },
      {
        path: 'admin',
        loadChildren: () => import('./modules/admin/admin.module').then((m) => m.AdminModule)
      },
      {
        path: 'masters/flowers',
        loadChildren: () =>
          import('./masters/flower-master/flower-master.module').then((m) => m.FlowerMasterModule)
      },
      {
        path: 'masters/customers',
        loadChildren: () =>
          import('./masters/customer-master/customer-master.module').then((m) => m.CustomerMasterModule)
      },
      {
        path: 'masters/suppliers',
        loadChildren: () =>
          import('./masters/supplier-master/supplier-master.module').then((m) => m.SupplierMasterModule)
      },
      {
        path: 'masters/expense-types',
        loadChildren: () =>
          import('./masters/expense-type-master/expense-type-master.module').then(
            (m) => m.ExpenseTypeMasterModule
          )
      },
      {
        path: 'masters/units',
        loadChildren: () => import('./masters/unit-master/unit-master.module').then((m) => m.UnitMasterModule)
      },
      {
        path: 'masters/waste-reasons',
        loadChildren: () =>
          import('./masters/waste-reason-master/waste-reason-master.module').then(
            (m) => m.WasteReasonMasterModule
          )
      },
      {
        path: 'masters/flower-categories',
        loadChildren: () =>
          import('./masters/flower-category-master/flower-category-master.module').then(
            (m) => m.FlowerCategoryMasterModule
          )
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

