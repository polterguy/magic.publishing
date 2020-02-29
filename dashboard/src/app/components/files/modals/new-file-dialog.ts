
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  path: string;
  header: string;
}

@Component({
  templateUrl: 'new-file-dialog.html',
})
export class NewFileDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<NewFileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  close() {
    this.dialogRef.close();
  }
}
