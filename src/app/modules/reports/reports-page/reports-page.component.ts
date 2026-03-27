import { Component } from '@angular/core';
import { ReportService } from '../../../services/report.service';

@Component({
  selector: 'app-reports-page',
  templateUrl: './reports-page.component.html',
  styleUrls: ['./reports-page.component.scss']
})
export class ReportsPageComponent {
  wastePercentage$ = this.reportService.wastePercentage$();
  topSelling$ = this.reportService.topSellingFlowers$();

  constructor(private reportService: ReportService) {}
}
