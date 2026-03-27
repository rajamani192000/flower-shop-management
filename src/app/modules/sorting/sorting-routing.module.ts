import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SortingPageComponent } from './sorting-page/sorting-page.component';

const routes: Routes = [{ path: '', component: SortingPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SortingRoutingModule {}
