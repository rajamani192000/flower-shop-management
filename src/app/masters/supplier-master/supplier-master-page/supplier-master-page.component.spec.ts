import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierMasterPageComponent } from './supplier-master-page.component';

describe('SupplierMasterPageComponent', () => {
  let component: SupplierMasterPageComponent;
  let fixture: ComponentFixture<SupplierMasterPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SupplierMasterPageComponent]
    });
    fixture = TestBed.createComponent(SupplierMasterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
