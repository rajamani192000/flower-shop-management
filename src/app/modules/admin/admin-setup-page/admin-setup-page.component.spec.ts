import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSetupPageComponent } from './admin-setup-page.component';

describe('AdminSetupPageComponent', () => {
  let component: AdminSetupPageComponent;
  let fixture: ComponentFixture<AdminSetupPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminSetupPageComponent]
    });
    fixture = TestBed.createComponent(AdminSetupPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
