import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlowerMasterPageComponent } from './flower-master-page/flower-master-page.component';

const routes: Routes = [{ path: '', component: FlowerMasterPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlowerMasterRoutingModule {}
