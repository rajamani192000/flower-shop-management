import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashBookPageComponent } from './cash-book-page.component';

describe('CashBookPageComponent', () => {
  let component: CashBookPageComponent;
  let fixture: ComponentFixture<CashBookPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CashBookPageComponent]
    });
    fixture = TestBed.createComponent(CashBookPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
