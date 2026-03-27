import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { WasteReasonMasterRoutingModule } from './waste-reason-master-routing.module';
import { WasteReasonMasterPageComponent } from './waste-reason-master-page/waste-reason-master-page.component';


@NgModule({
  declarations: [
    WasteReasonMasterPageComponent
  ],
  imports: [
    SharedModule,
    WasteReasonMasterRoutingModule
  ]
})
export class WasteReasonMasterModule { }

