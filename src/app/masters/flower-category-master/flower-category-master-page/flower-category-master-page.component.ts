import { Component } from '@angular/core';
import { CrudField } from '../../../shared/models/crud.models';

@Component({
  selector: 'app-flower-category-master-page',
  templateUrl: './flower-category-master-page.component.html',
  styleUrls: ['./flower-category-master-page.component.scss']
})
export class FlowerCategoryMasterPageComponent {
  readonly collection = 'flowerCategories';
  readonly fields: CrudField[] = [
    {
      key: 'name',
      label: 'Category',
      type: 'select',
      required: true,
      options: ['Loose Flower', 'Garland', 'Decoration Flower', 'Temple Flower']
    }
  ];

}
