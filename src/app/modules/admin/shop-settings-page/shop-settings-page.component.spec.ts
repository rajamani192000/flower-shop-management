import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopSettingsPageComponent } from './shop-settings-page.component';

describe('ShopSettingsPageComponent', () => {
  let component: ShopSettingsPageComponent;
  let fixture: ComponentFixture<ShopSettingsPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShopSettingsPageComponent]
    });
    fixture = TestBed.createComponent(ShopSettingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
