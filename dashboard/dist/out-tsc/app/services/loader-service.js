/*
 * Magic Publishing is MIT licensed, copyright Thomas Hansen - thomas@servergardens.com - Se enclosed LICENSE files for terms of use
 */

import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
/*
 * Service that helps you determine if there is an ongoing HTTP request
 * towards your backend or not.
 * Used to display "spinner".
 */
let LoaderService = class LoaderService {
    constructor() {
        // If true, one or more Ajax requests are currently going towards your backend.
        this.isLoading = new BehaviorSubject(false);
    }
    // Changes the state to "is loading".
    show() {
        setTimeout(() => {
            this.isLoading.next(true);
        });
    }
    // Changes the state to "is NOT loading".
    hide() {
        setTimeout(() => {
            this.isLoading.next(false);
        });
    }
};
LoaderService = __decorate([
    Injectable()
], LoaderService);
export { LoaderService };
//# sourceMappingURL=loader-service.js.map