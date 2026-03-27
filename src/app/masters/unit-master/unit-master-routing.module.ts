import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnitMasterPageComponent } from './unit-master-page/unit-master-page.component';

const routes: Routes = [{ path: '', component: UnitMasterPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnitMasterRoutingModule {}
