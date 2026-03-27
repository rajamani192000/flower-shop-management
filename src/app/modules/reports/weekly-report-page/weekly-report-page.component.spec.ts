import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyReportPageComponent } from './weekly-report-page.component';

describe('WeeklyReportPageComponent', () => {
  let component: WeeklyReportPageComponent;
  let fixture: ComponentFixture<WeeklyReportPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WeeklyReportPageComponent]
    });
    fixture = TestBed.createComponent(WeeklyReportPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
