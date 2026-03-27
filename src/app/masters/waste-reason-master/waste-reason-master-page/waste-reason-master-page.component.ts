import { Component } from '@angular/core';
import { CrudField } from '../../../shared/models/crud.models';

@Component({
  selector: 'app-waste-reason-master-page',
  templateUrl: './waste-reason-master-page.component.html',
  styleUrls: ['./waste-reason-master-page.component.scss']
})
export class WasteReasonMasterPageComponent {
  readonly collection = 'wasteReasons';
  readonly fields: CrudField[] = [
    { key: 'name', label: 'Reason', type: 'select', required: true, options: ['Spoiled', 'Damaged', 'Unsold'] }
  ];

}
