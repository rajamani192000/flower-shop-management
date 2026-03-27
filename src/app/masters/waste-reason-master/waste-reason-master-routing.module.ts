import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WasteReasonMasterPageComponent } from './waste-reason-master-page/waste-reason-master-page.component';

const routes: Routes = [{ path: '', component: WasteReasonMasterPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WasteReasonMasterRoutingModule {}
