import { Component } from '@angular/core';
import { CrudField } from '../../../shared/models/crud.models';
import { COLLECTIONS } from '../../../shared/utils/app.constants';

@Component({
  selector: 'app-waste-page',
  templateUrl: './waste-page.component.html',
  styleUrls: ['./waste-page.component.scss']
})
export class WastePageComponent {
  readonly collection = COLLECTIONS.waste;
  readonly fields: CrudField[] = [
    { key: 'flowerId', label: 'Flower', type: 'text', required: true },
    { key: 'weight', label: 'Weight', type: 'number', required: true },
    { key: 'reason', label: 'Reason', type: 'select', options: ['Spoiled', 'Damaged', 'Unsold'] },
    { key: 'date', label: 'Date', type: 'date', required: true }
  ];

}
