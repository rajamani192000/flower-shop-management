import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowerMasterPageComponent } from './flower-master-page.component';

describe('FlowerMasterPageComponent', () => {
  let component: FlowerMasterPageComponent;
  let fixture: ComponentFixture<FlowerMasterPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FlowerMasterPageComponent]
    });
    fixture = TestBed.createComponent(FlowerMasterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
