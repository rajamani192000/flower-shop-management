import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { UnitMasterRoutingModule } from './unit-master-routing.module';
import { UnitMasterPageComponent } from './unit-master-page/unit-master-page.component';


@NgModule({
  declarations: [
    UnitMasterPageComponent
  ],
  imports: [
    SharedModule,
    UnitMasterRoutingModule
  ]
})
export class UnitMasterModule { }

