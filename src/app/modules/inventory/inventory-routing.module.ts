import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoxTrackingPageComponent } from './box-tracking-page/box-tracking-page.component';
import { StockStatusPageComponent } from './stock-status-page/stock-status-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'stock-status', pathMatch: 'full' },
  { path: 'stock-status', component: StockStatusPageComponent },
  { path: 'box-tracking', component: BoxTrackingPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule {}
