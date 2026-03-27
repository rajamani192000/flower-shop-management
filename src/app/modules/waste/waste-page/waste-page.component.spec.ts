import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WastePageComponent } from './waste-page.component';

describe('WastePageComponent', () => {
  let component: WastePageComponent;
  let fixture: ComponentFixture<WastePageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WastePageComponent]
    });
    fixture = TestBed.createComponent(WastePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
