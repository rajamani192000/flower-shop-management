import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupplierMasterPageComponent } from './supplier-master-page/supplier-master-page.component';

const routes: Routes = [{ path: '', component: SupplierMasterPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierMasterRoutingModule {}
