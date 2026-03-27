import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string): void {
    this.open(message || 'Operation completed', ['success-toast']);
  }

  showError(message: string): void {
    this.open(message || 'Operation failed', ['error-toast']);
  }

  showWarning(message: string): void {
    this.open(message || 'Warning', ['warning-toast']);
  }

  private open(message: string, panelClass: string[]): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass
    });
  }
}

