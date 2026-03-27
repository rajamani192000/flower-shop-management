import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { SortingRoutingModule } from './sorting-routing.module';
import { SortingPageComponent } from './sorting-page/sorting-page.component';


@NgModule({
  declarations: [
    SortingPageComponent
  ],
  imports: [
    SharedModule,
    SortingRoutingModule
  ]
})
export class SortingModule { }

