import { Component } from '@angular/core';
import { CrudField } from '../../../shared/models/crud.models';
import { COLLECTIONS } from '../../../shared/utils/app.constants';

@Component({
  selector: 'app-sorting-page',
  templateUrl: './sorting-page.component.html',
  styleUrls: ['./sorting-page.component.scss']
})
export class SortingPageComponent {
  readonly collection = COLLECTIONS.sorting;
  readonly fields: CrudField[] = [
    { key: 'purchaseId', label: 'Purchase Id', type: 'text', required: true },
    { key: 'grossWeight', label: 'Gross Weight', type: 'number', required: true },
    { key: 'wasteWeight', label: 'Waste Weight', type: 'number', required: true },
    { key: 'netSellableWeight', label: 'Net Sellable Weight', type: 'number', required: true },
    { key: 'date', label: 'Date', type: 'date', required: true }
  ];

}
