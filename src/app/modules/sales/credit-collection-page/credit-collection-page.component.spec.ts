import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCollectionPageComponent } from './credit-collection-page.component';

describe('CreditCollectionPageComponent', () => {
  let component: CreditCollectionPageComponent;
  let fixture: ComponentFixture<CreditCollectionPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreditCollectionPageComponent]
    });
    fixture = TestBed.createComponent(CreditCollectionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
