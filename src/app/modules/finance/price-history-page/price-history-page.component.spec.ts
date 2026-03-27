import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceHistoryPageComponent } from './price-history-page.component';

describe('PriceHistoryPageComponent', () => {
  let component: PriceHistoryPageComponent;
  let fixture: ComponentFixture<PriceHistoryPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PriceHistoryPageComponent]
    });
    fixture = TestBed.createComponent(PriceHistoryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
