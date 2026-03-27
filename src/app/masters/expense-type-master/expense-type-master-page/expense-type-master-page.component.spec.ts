import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseTypeMasterPageComponent } from './expense-type-master-page.component';

describe('ExpenseTypeMasterPageComponent', () => {
  let component: ExpenseTypeMasterPageComponent;
  let fixture: ComponentFixture<ExpenseTypeMasterPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpenseTypeMasterPageComponent]
    });
    fixture = TestBed.createComponent(ExpenseTypeMasterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
