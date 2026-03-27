import { Component } from '@angular/core';
import { CrudField } from '../../../shared/models/crud.models';
import { COLLECTIONS } from '../../../shared/utils/app.constants';

@Component({
  selector: 'app-expenses-page',
  templateUrl: './expenses-page.component.html',
  styleUrls: ['./expenses-page.component.scss']
})
export class ExpensesPageComponent {
  readonly collection = COLLECTIONS.expenses;
  readonly fields: CrudField[] = [
    { key: 'expenseType', label: 'Expense Type', type: 'select', required: true, options: ['Transport', 'Tea', 'Misc', 'Other'] },
    { key: 'amount', label: 'Amount', type: 'number', required: true },
    { key: 'note', label: 'Note', type: 'textarea' },
    { key: 'date', label: 'Date', type: 'date', required: true }
  ];

}
