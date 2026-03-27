import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerMasterPageComponent } from './customer-master-page/customer-master-page.component';

const routes: Routes = [{ path: '', component: CustomerMasterPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerMasterRoutingModule {}
