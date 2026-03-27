import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { ExpensesRoutingModule } from './expenses-routing.module';
import { ExpensesPageComponent } from './expenses-page/expenses-page.component';


@NgModule({
  declarations: [
    ExpensesPageComponent
  ],
  imports: [
    SharedModule,
    ExpensesRoutingModule
  ]
})
export class ExpensesModule { }

