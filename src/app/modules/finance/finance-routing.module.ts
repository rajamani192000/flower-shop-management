import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CashBookPageComponent } from './cash-book-page/cash-book-page.component';
import { PriceHistoryPageComponent } from './price-history-page/price-history-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'cash-book', pathMatch: 'full' },
  { path: 'cash-book', component: CashBookPageComponent },
  { path: 'price-history', component: PriceHistoryPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinanceRoutingModule {}
