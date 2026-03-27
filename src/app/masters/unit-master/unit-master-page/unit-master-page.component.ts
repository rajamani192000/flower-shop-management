import { Component } from '@angular/core';
import { CrudField } from '../../../shared/models/crud.models';

@Component({
  selector: 'app-unit-master-page',
  templateUrl: './unit-master-page.component.html',
  styleUrls: ['./unit-master-page.component.scss']
})
export class UnitMasterPageComponent {
  readonly collection = 'units';
  readonly fields: CrudField[] = [{ key: 'name', label: 'Unit', type: 'select', required: true, options: ['KG', 'Gram', 'Piece', 'Garland'] }];

}
