import { Component } from '@angular/core';
import { CrudField } from '../../../shared/models/crud.models';
import { COLLECTIONS } from '../../../shared/utils/app.constants';

@Component({
  selector: 'app-customer-master-page',
  templateUrl: './customer-master-page.component.html',
  styleUrls: ['./customer-master-page.component.scss']
})
export class CustomerMasterPageComponent {
  readonly collection = COLLECTIONS.customers;
  readonly fields: CrudField[] = [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'phone', label: 'Phone', type: 'text', required: true },
    { key: 'address', label: 'Address', type: 'textarea' },
    { key: 'creditLimit', label: 'Credit Limit', type: 'number' },
    {
      key: 'customerType',
      label: 'Customer Type',
      type: 'select',
      options: ['Temple', 'Tea Shop', 'Retail', 'Decorator']
    }
  ];

}
