import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { FlowerMasterRoutingModule } from './flower-master-routing.module';
import { FlowerMasterPageComponent } from './flower-master-page/flower-master-page.component';


@NgModule({
  declarations: [
    FlowerMasterPageComponent
  ],
  imports: [
    SharedModule,
    FlowerMasterRoutingModule
  ]
})
export class FlowerMasterModule { }

