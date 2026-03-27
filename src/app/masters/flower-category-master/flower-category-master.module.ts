import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { FlowerCategoryMasterRoutingModule } from './flower-category-master-routing.module';
import { FlowerCategoryMasterPageComponent } from './flower-category-master-page/flower-category-master-page.component';


@NgModule({
  declarations: [
    FlowerCategoryMasterPageComponent
  ],
  imports: [
    SharedModule,
    FlowerCategoryMasterRoutingModule
  ]
})
export class FlowerCategoryMasterModule { }

