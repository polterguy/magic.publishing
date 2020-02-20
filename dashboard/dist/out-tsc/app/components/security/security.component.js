/*
 * Magic Publishing is MIT licensed, copyright Thomas Hansen - thomas@servergardens.com - Se enclosed LICENSE files for terms of use
 */

import { __decorate } from "tslib";
import { Component } from '@angular/core';
let SecurityComponent = class SecurityComponent {
    constructor(snackBar, service) {
        this.snackBar = snackBar;
        this.service = service;
        this.password = '';
        this.passwordRepeat = '';
    }
    save() {
        if (this.password !== this.passwordRepeat || this.password === '') {
            this.snackBar.open('Passwords must match and be an actual password', 'Close', {
                duration: 5000,
                panelClass: ['error-snackbar'],
            });
            return;
        }
        this.service.changeMyPassword(this.password).subscribe(res => {
            this.snackBar.open('Your password was successfully changed', 'Close', {
                duration: 2000,
            });
        }, error => {
            this.snackBar.open(error.error.message, 'Close', {
                duration: 5000,
                panelClass: ['error-snackbar'],
            });
        });
    }
};
SecurityComponent = __decorate([
    Component({
        selector: 'app-security',
        templateUrl: './security.component.html',
        styleUrls: ['./security.component.scss']
    })
], SecurityComponent);
export { SecurityComponent };
//# sourceMappingURL=security.component.js.map