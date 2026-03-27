import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { ExpenseTypeMasterRoutingModule } from './expense-type-master-routing.module';
import { ExpenseTypeMasterPageComponent } from './expense-type-master-page/expense-type-master-page.component';


@NgModule({
  declarations: [
    ExpenseTypeMasterPageComponent
  ],
  imports: [
    SharedModule,
    ExpenseTypeMasterRoutingModule
  ]
})
export class ExpenseTypeMasterModule { }

