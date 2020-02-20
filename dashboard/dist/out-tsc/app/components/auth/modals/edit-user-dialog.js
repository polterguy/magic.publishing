/*
 * Magic Publishing is MIT licensed, copyright Thomas Hansen - thomas@servergardens.com - Se enclosed LICENSE files for terms of use
 */

import { __decorate, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
let EditUserDialogComponent = class EditUserDialogComponent {
    constructor(dialogRef, data, snackBar, authService) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.snackBar = snackBar;
        this.authService = authService;
        this.userRoles = null;
        this.allRoles = null;
        this.selectedValue = null;
    }
    ngOnInit() {
        this.getUserRoles();
        this.authService.getRoles({
            limit: 1000,
            offset: 0,
        }).subscribe(res => {
            this.allRoles = res;
        }, error => {
            this.snackBar.open(error.error.message, 'Close', {
                duration: 5000,
                panelClass: ['error-snackbar'],
            });
        });
    }
    getUserRoles() {
        this.authService.getUserRoles(this.data.username).subscribe(res => {
            this.userRoles = res || [];
        }, error => {
            this.snackBar.open(error.error.message, 'Close', {
                duration: 5000,
                panelClass: ['error-snackbar'],
            });
        });
    }
    addRole(e) {
        this.authService.addRoleToUser(this.data.username, e.value.name).subscribe(res => {
            this.snackBar.open('Role added to user', 'Close', {
                duration: 2000,
            });
            this.selectedValue = undefined;
            this.getUserRoles();
        }, error => {
            this.snackBar.open(error.error.message, 'Close', {
                duration: 5000,
                panelClass: ['error-snackbar'],
            });
            this.selectedValue = undefined;
        });
    }
    deleteRoleFromUser(role) {
        this.authService.deleteRoleFromUser(this.data.username, role).subscribe(res => {
            this.snackBar.open('Role removed from user', 'Close', {
                duration: 2000,
            });
            this.getUserRoles();
        }, error => {
            this.snackBar.open(error.error.message, 'Close', {
                duration: 5000,
                panelClass: ['error-snackbar'],
            });
        });
    }
    close() {
        this.dialogRef.close();
    }
};
EditUserDialogComponent = __decorate([
    Component({
        templateUrl: 'edit-user-dialog.html',
        styleUrls: ['edit-user-dialog.scss']
    }),
    __param(1, Inject(MAT_DIALOG_DATA))
], EditUserDialogComponent);
export { EditUserDialogComponent };
//# sourceMappingURL=edit-user-dialog.js.map