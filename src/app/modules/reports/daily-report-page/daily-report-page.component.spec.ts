import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyReportPageComponent } from './daily-report-page.component';

describe('DailyReportPageComponent', () => {
  let component: DailyReportPageComponent;
  let fixture: ComponentFixture<DailyReportPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DailyReportPageComponent]
    });
    fixture = TestBed.createComponent(DailyReportPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
