import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DailyReportPageComponent } from './daily-report-page/daily-report-page.component';
import { MonthlyReportPageComponent } from './monthly-report-page/monthly-report-page.component';
import { ProfitAnalysisPageComponent } from './profit-analysis-page/profit-analysis-page.component';
import { ReportsPageComponent } from './reports-page/reports-page.component';
import { WasteAnalysisPageComponent } from './waste-analysis-page/waste-analysis-page.component';
import { WeeklyReportPageComponent } from './weekly-report-page/weekly-report-page.component';

const routes: Routes = [
  { path: '', component: ReportsPageComponent },
  { path: 'daily', component: DailyReportPageComponent },
  { path: 'weekly', component: WeeklyReportPageComponent },
  { path: 'monthly', component: MonthlyReportPageComponent },
  { path: 'profit-analysis', component: ProfitAnalysisPageComponent },
  { path: 'waste-analysis', component: WasteAnalysisPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule {}
