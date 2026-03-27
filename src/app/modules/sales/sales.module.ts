import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { SalesRoutingModule } from './sales-routing.module';
import { SalesPageComponent } from './sales-page/sales-page.component';
import { CreditSalesPageComponent } from './credit-sales-page/credit-sales-page.component';
import { CreditCollectionPageComponent } from './credit-collection-page/credit-collection-page.component';


@NgModule({
  declarations: [
    SalesPageComponent,
    CreditSalesPageComponent,
    CreditCollectionPageComponent
  ],
  imports: [
    SharedModule,
    SalesRoutingModule
  ]
})
export class SalesModule { }

