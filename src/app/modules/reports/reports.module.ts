import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsPageComponent } from './reports-page/reports-page.component';
import { DailyReportPageComponent } from './daily-report-page/daily-report-page.component';
import { WeeklyReportPageComponent } from './weekly-report-page/weekly-report-page.component';
import { MonthlyReportPageComponent } from './monthly-report-page/monthly-report-page.component';
import { ProfitAnalysisPageComponent } from './profit-analysis-page/profit-analysis-page.component';
import { WasteAnalysisPageComponent } from './waste-analysis-page/waste-analysis-page.component';


@NgModule({
  declarations: [
    ReportsPageComponent,
    DailyReportPageComponent,
    WeeklyReportPageComponent,
    MonthlyReportPageComponent,
    ProfitAnalysisPageComponent,
    WasteAnalysisPageComponent
  ],
  imports: [
    SharedModule,
    ReportsRoutingModule
  ]
})
export class ReportsModule { }

