import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowerCategoryMasterPageComponent } from './flower-category-master-page.component';

describe('FlowerCategoryMasterPageComponent', () => {
  let component: FlowerCategoryMasterPageComponent;
  let fixture: ComponentFixture<FlowerCategoryMasterPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FlowerCategoryMasterPageComponent]
    });
    fixture = TestBed.createComponent(FlowerCategoryMasterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
