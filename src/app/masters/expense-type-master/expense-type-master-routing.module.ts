import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpenseTypeMasterPageComponent } from './expense-type-master-page/expense-type-master-page.component';

const routes: Routes = [{ path: '', component: ExpenseTypeMasterPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpenseTypeMasterRoutingModule {}
