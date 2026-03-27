import { Component } from '@angular/core';
import { CrudField } from '../../../shared/models/crud.models';
import { COLLECTIONS } from '../../../shared/utils/app.constants';

@Component({
  selector: 'app-supplier-master-page',
  templateUrl: './supplier-master-page.component.html',
  styleUrls: ['./supplier-master-page.component.scss']
})
export class SupplierMasterPageComponent {
  readonly collection = COLLECTIONS.suppliers;
  readonly fields: CrudField[] = [
    { key: 'supplierName', label: 'Supplier Name', type: 'text', required: true },
    { key: 'location', label: 'Location', type: 'text' },
    { key: 'phone', label: 'Phone', type: 'text' },
    { key: 'paymentType', label: 'Payment Type', type: 'select', options: ['Cash', 'UPI', 'Credit'] }
  ];

}
