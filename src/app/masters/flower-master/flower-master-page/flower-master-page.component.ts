import { Component } from '@angular/core';
import { CrudField } from '../../../shared/models/crud.models';
import { COLLECTIONS } from '../../../shared/utils/app.constants';

@Component({
  selector: 'app-flower-master-page',
  templateUrl: './flower-master-page.component.html',
  styleUrls: ['./flower-master-page.component.scss']
})
export class FlowerMasterPageComponent {
  readonly collection = COLLECTIONS.flowers;
  readonly fields: CrudField[] = [
    { key: 'flowerName', label: 'Flower Name', type: 'text', required: true },
    { key: 'unit', label: 'Unit', type: 'select', required: true, options: ['KG', 'Gram', 'Piece', 'Garland'] },
    {
      key: 'category',
      label: 'Category',
      type: 'select',
      required: true,
      options: ['Loose Flower', 'Garland', 'Decoration Flower', 'Temple Flower']
    },
    { key: 'defaultPrice', label: 'Default Price', type: 'number', required: true },
    { key: 'status', label: 'Status', type: 'select', required: true, options: ['true', 'false'] }
  ];

}
