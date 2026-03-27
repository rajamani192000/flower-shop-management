import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminSetupPageComponent } from './admin-setup-page/admin-setup-page.component';
import { ShopSettingsPageComponent } from './shop-settings-page/shop-settings-page.component';
import { StaffManagementPageComponent } from './staff-management-page/staff-management-page.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'staff-management', pathMatch: 'full' },
  { path: 'staff-management', component: StaffManagementPageComponent },
  { path: 'database-setup', component: AdminSetupPageComponent },
  { path: 'shop-settings', component: ShopSettingsPageComponent },
  { path: 'profile', component: ProfilePageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
