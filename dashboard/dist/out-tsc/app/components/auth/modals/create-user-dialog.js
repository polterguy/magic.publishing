/*
 * Magic Publishing is MIT licensed, copyright Thomas Hansen - thomas@servergardens.com - Se enclosed LICENSE files for terms of use
 */

import { __decorate, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
let CreateUserDialogComponent = class CreateUserDialogComponent {
    constructor(dialogRef, data, snackBar, authService) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.snackBar = snackBar;
        this.authService = authService;
    }
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
};
CreateUserDialogComponent = __decorate([
    Component({
        templateUrl: 'create-user-dialog.html',
    }),
    __param(1, Inject(MAT_DIALOG_DATA))
], CreateUserDialogComponent);
export { CreateUserDialogComponent };
//# sourceMappingURL=create-user-dialog.js.map