import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditSalesPageComponent } from './credit-sales-page.component';

describe('CreditSalesPageComponent', () => {
  let component: CreditSalesPageComponent;
  let fixture: ComponentFixture<CreditSalesPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreditSalesPageComponent]
    });
    fixture = TestBed.createComponent(CreditSalesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
