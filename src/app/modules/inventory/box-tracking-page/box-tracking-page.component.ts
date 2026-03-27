import { Component } from '@angular/core';
import { CrudField } from '../../../shared/models/crud.models';
import { COLLECTIONS } from '../../../shared/utils/app.constants';

@Component({
  selector: 'app-box-tracking-page',
  templateUrl: './box-tracking-page.component.html',
  styleUrls: ['./box-tracking-page.component.scss']
})
export class BoxTrackingPageComponent {
  readonly collection = COLLECTIONS.boxTracking;
  readonly fields: CrudField[] = [
    { key: 'boxNumber', label: 'Box Number', type: 'text', required: true },
    { key: 'flowerId', label: 'Flower', type: 'text', required: true },
    { key: 'supplierId', label: 'Supplier', type: 'text', required: true },
    { key: 'grossWeight', label: 'Gross Weight', type: 'number', required: true },
    { key: 'netWeight', label: 'Net Weight', type: 'number', required: true },
    { key: 'purchasePrice', label: 'Purchase Price', type: 'number', required: true },
    { key: 'date', label: 'Date', type: 'date', required: true }
  ];

}
