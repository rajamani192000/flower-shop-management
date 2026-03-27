import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { SupplierMasterRoutingModule } from './supplier-master-routing.module';
import { SupplierMasterPageComponent } from './supplier-master-page/supplier-master-page.component';


@NgModule({
  declarations: [
    SupplierMasterPageComponent
  ],
  imports: [
    SharedModule,
    SupplierMasterRoutingModule
  ]
})
export class SupplierMasterModule { }

