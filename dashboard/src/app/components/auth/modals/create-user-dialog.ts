/*
 * Magic Publishing is MIT licensed, copyright Thomas Hansen - thomas@servergardens.com - Se enclosed LICENSE files for terms of use
 */

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth-service';

export interface DialogData {
  name: string;
  password: string;
}

@Component({
  templateUrl: 'create-user-dialog.html',
})
export class CreateUserDialogComponent {

  public passwordRepeat: string;

  constructor(
    public dialogRef: MatDialogRef<CreateUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private snackBar: MatSnackBar,
    private authService: AuthService) { }

  ok() {
    if (this.passwordRepeat !== this.data.password) {
      this.snackBar.open('Passwords are not matching', 'Close', {
        duration: 2000,
        panelClass: ['error-snackbar'],
      });
      return;
    }
    this.authService.createUser(this.data.name, this.data.password).subscribe(res => {
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
