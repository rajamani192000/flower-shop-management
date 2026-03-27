import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreditCollectionPageComponent } from './credit-collection-page/credit-collection-page.component';
import { CreditSalesPageComponent } from './credit-sales-page/credit-sales-page.component';
import { SalesPageComponent } from './sales-page/sales-page.component';

const routes: Routes = [
  { path: '', component: SalesPageComponent },
  { path: 'credit-sales', component: CreditSalesPageComponent },
  { path: 'credit-collection', component: CreditCollectionPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule {}
