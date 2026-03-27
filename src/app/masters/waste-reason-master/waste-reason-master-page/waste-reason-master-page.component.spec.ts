import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WasteReasonMasterPageComponent } from './waste-reason-master-page.component';

describe('WasteReasonMasterPageComponent', () => {
  let component: WasteReasonMasterPageComponent;
  let fixture: ComponentFixture<WasteReasonMasterPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WasteReasonMasterPageComponent]
    });
    fixture = TestBed.createComponent(WasteReasonMasterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
