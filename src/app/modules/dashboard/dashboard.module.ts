import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { NgChartsModule } from 'ng2-charts';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';


@NgModule({
  declarations: [
    DashboardPageComponent
  ],
  imports: [
    SharedModule,
    NgChartsModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }

