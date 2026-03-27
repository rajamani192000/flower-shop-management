import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { InventoryRoutingModule } from './inventory-routing.module';
import { StockStatusPageComponent } from './stock-status-page/stock-status-page.component';
import { BoxTrackingPageComponent } from './box-tracking-page/box-tracking-page.component';


@NgModule({
  declarations: [
    StockStatusPageComponent,
    BoxTrackingPageComponent
  ],
  imports: [
    SharedModule,
    InventoryRoutingModule
  ]
})
export class InventoryModule { }

