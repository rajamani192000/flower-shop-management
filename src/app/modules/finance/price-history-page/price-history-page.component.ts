import { Component } from '@angular/core';
import { CrudField } from '../../../shared/models/crud.models';
import { COLLECTIONS } from '../../../shared/utils/app.constants';

@Component({
  selector: 'app-price-history-page',
  templateUrl: './price-history-page.component.html',
  styleUrls: ['./price-history-page.component.scss']
})
export class PriceHistoryPageComponent {
  readonly collection = COLLECTIONS.priceHistory;
  readonly fields: CrudField[] = [
    { key: 'flowerId', label: 'Flower', type: 'text', required: true },
    { key: 'date', label: 'Date', type: 'date', required: true },
    { key: 'purchasePrice', label: 'Purchase Price', type: 'number', required: true },
    { key: 'salePrice', label: 'Sale Price', type: 'number', required: true }
  ];

}
