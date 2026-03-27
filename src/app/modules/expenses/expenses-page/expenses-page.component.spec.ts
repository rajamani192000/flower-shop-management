import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesPageComponent } from './expenses-page.component';

describe('ExpensesPageComponent', () => {
  let component: ExpensesPageComponent;
  let fixture: ComponentFixture<ExpensesPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpensesPageComponent]
    });
    fixture = TestBed.createComponent(ExpensesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
