import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialogue',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './confirmation-dialogue.component.html',
  styleUrl: './confirmation-dialogue.component.scss'
})
export class ConfirmationDialogueComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public totalAmount: number
  ) {}

  closeDialog(result: boolean): void {
    this.dialogRef.close(result);
  }
}
