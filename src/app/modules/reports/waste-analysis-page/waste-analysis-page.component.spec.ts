import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WasteAnalysisPageComponent } from './waste-analysis-page.component';

describe('WasteAnalysisPageComponent', () => {
  let component: WasteAnalysisPageComponent;
  let fixture: ComponentFixture<WasteAnalysisPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WasteAnalysisPageComponent]
    });
    fixture = TestBed.createComponent(WasteAnalysisPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
