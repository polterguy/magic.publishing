/*
 * Magic Publishing is MIT licensed, copyright Thomas Hansen - thomas@servergardens.com - Se enclosed LICENSE files for terms of use
 */

import { __decorate, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
let CreateRoleDialogComponent = class CreateRoleDialogComponent {
    constructor(dialogRef, data, snackBar, authService) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.snackBar = snackBar;
        this.authService = authService;
    }
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
};
CreateRoleDialogComponent = __decorate([
    Component({
        templateUrl: 'create-role-dialog.html',
    }),
    __param(1, Inject(MAT_DIALOG_DATA))
], CreateRoleDialogComponent);
export { CreateRoleDialogComponent };
//# sourceMappingURL=create-role-dialog.js.map