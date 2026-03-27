import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfitAnalysisPageComponent } from './profit-analysis-page.component';

describe('ProfitAnalysisPageComponent', () => {
  let component: ProfitAnalysisPageComponent;
  let fixture: ComponentFixture<ProfitAnalysisPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfitAnalysisPageComponent]
    });
    fixture = TestBed.createComponent(ProfitAnalysisPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
