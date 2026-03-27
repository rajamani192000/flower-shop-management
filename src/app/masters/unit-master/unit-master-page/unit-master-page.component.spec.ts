import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitMasterPageComponent } from './unit-master-page.component';

describe('UnitMasterPageComponent', () => {
  let component: UnitMasterPageComponent;
  let fixture: ComponentFixture<UnitMasterPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnitMasterPageComponent]
    });
    fixture = TestBed.createComponent(UnitMasterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
