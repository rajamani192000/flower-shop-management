import { Component } from '@angular/core';
import { CrudField } from '../../../shared/models/crud.models';

@Component({
  selector: 'app-expense-type-master-page',
  templateUrl: './expense-type-master-page.component.html',
  styleUrls: ['./expense-type-master-page.component.scss']
})
export class ExpenseTypeMasterPageComponent {
  readonly collection = 'expenseTypes';
  readonly fields: CrudField[] = [{ key: 'name', label: 'Expense Type', type: 'text', required: true }];

}
