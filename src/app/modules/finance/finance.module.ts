import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { FinanceRoutingModule } from './finance-routing.module';
import { CashBookPageComponent } from './cash-book-page/cash-book-page.component';
import { PriceHistoryPageComponent } from './price-history-page/price-history-page.component';


@NgModule({
  declarations: [
    CashBookPageComponent,
    PriceHistoryPageComponent
  ],
  imports: [
    SharedModule,
    FinanceRoutingModule
  ]
})
export class FinanceModule { }

