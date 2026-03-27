import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WastePageComponent } from './waste-page/waste-page.component';

const routes: Routes = [{ path: '', component: WastePageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WasteRoutingModule {}
