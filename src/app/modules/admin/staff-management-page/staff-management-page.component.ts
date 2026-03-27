import { Component } from '@angular/core';
import { CrudField } from '../../../shared/models/crud.models';
import { COLLECTIONS } from '../../../shared/utils/app.constants';

@Component({
  selector: 'app-staff-management-page',
  templateUrl: './staff-management-page.component.html',
  styleUrls: ['./staff-management-page.component.scss']
})
export class StaffManagementPageComponent {
  readonly collection = COLLECTIONS.users;
  readonly fields: CrudField[] = [
    { key: 'uid', label: 'UID', type: 'text', required: true },
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'email', label: 'Email', type: 'text', required: true },
    { key: 'role', label: 'Role', type: 'select', options: ['Admin', 'Staff', 'Accountant'], required: true },
    { key: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'], required: true }
  ];

}
