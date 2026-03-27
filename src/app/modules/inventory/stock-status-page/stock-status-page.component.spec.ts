import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockStatusPageComponent } from './stock-status-page.component';

describe('StockStatusPageComponent', () => {
  let component: StockStatusPageComponent;
  let fixture: ComponentFixture<StockStatusPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StockStatusPageComponent]
    });
    fixture = TestBed.createComponent(StockStatusPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
