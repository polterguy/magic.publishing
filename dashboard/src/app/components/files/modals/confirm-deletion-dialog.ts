
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  path: string;
}

@Component({
  templateUrl: 'confirm-deletion-dialog.html',
})
export class ConfirmDeletionDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDeletionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  close() {
    this.dialogRef.close();
  }
}
