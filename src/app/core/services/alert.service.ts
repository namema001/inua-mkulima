import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private snackBar: MatSnackBar) {}

  showAlert(message: string, type: 'success' | 'error' = 'success'): void {
    const config: MatSnackBarConfig = {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [`alert-${type}`],
    };

    this.snackBar.open(message, 'Close', config);
  }

  success(message: string): void {
    this.showAlert(message, 'success');
  }

  error(message: string): void {
    this.showAlert(message, 'error');
  }
}
