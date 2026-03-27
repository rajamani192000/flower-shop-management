import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxTrackingPageComponent } from './box-tracking-page.component';

describe('BoxTrackingPageComponent', () => {
  let component: BoxTrackingPageComponent;
  let fixture: ComponentFixture<BoxTrackingPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BoxTrackingPageComponent]
    });
    fixture = TestBed.createComponent(BoxTrackingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
