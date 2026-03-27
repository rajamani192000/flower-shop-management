import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { WasteRoutingModule } from './waste-routing.module';
import { WastePageComponent } from './waste-page/waste-page.component';


@NgModule({
  declarations: [
    WastePageComponent
  ],
  imports: [
    SharedModule,
    WasteRoutingModule
  ]
})
export class WasteModule { }

