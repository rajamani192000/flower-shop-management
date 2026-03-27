import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { AdminRoutingModule } from './admin-routing.module';
import { StaffManagementPageComponent } from './staff-management-page/staff-management-page.component';
import { ShopSettingsPageComponent } from './shop-settings-page/shop-settings-page.component';
import { AdminSetupPageComponent } from './admin-setup-page/admin-setup-page.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';


@NgModule({
  declarations: [
    StaffManagementPageComponent,
    ShopSettingsPageComponent,
    AdminSetupPageComponent,
    ProfilePageComponent
  ],
  imports: [
    SharedModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }

