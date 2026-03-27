import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { CustomerMasterRoutingModule } from './customer-master-routing.module';
import { CustomerMasterPageComponent } from './customer-master-page/customer-master-page.component';


@NgModule({
  declarations: [
    CustomerMasterPageComponent
  ],
  imports: [
    SharedModule,
    CustomerMasterRoutingModule
  ]
})
export class CustomerMasterModule { }

