import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlowerCategoryMasterPageComponent } from './flower-category-master-page/flower-category-master-page.component';

const routes: Routes = [{ path: '', component: FlowerCategoryMasterPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlowerCategoryMasterRoutingModule {}
