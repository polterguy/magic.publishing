/*
 * Magic Publishing is MIT licensed, copyright Thomas Hansen - thomas@servergardens.com - Se enclosed LICENSE files for terms of use
 */

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth-service';

export interface DialogData {
  name: string;
}

@Component({
  templateUrl: 'create-role-dialog.html',
})
export class CreateRoleDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<CreateRoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private snackBar: MatSnackBar,
    private authService: AuthService) { }

  ok() {
    this.authService.createRole(this.data.name).subscribe(res => {
      this.dialogRef.close(this.data);
    }, error => {
      this.snackBar.open(error.error.message, 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar'],
      });
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}
