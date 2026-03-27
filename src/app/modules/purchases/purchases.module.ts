import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { PurchasesRoutingModule } from './purchases-routing.module';
import { PurchasesPageComponent } from './purchases-page/purchases-page.component';


@NgModule({
  declarations: [
    PurchasesPageComponent
  ],
  imports: [
    SharedModule,
    PurchasesRoutingModule
  ]
})
export class PurchasesModule { }

