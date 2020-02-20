/*
 * Magic Publishing is MIT licensed, copyright Thomas Hansen - thomas@servergardens.com - Se enclosed LICENSE files for terms of use
 */

import { __decorate } from "tslib";
import { Injectable } from "@angular/core";
import { HttpResponse } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
/*
 * Our HTTP interceptor that change sthe LoaderService's state according to whether or not
 * an Ajax request is currently going towards your backend API.
 */
let LoaderInterceptor = class LoaderInterceptor {
    constructor(loadingService) {
        this.loadingService = loadingService;
        // Notice, to support multiple requests, we need to track how many "open" requests we currently have.
        this.totalRequests = 0;
    }
    intercept(request, next) {
        const isCount = request.url.endsWith('-count');
        if (!isCount) {
            this.totalRequests++;
            this.loadingService.show();
        }
        return next.handle(request).pipe(tap(res => {
            if (res instanceof HttpResponse) {
                if (!isCount) {
                    this.decreaseRequests();
                }
            }
        }), catchError(err => {
            if (!isCount) {
                this.decreaseRequests();
            }
            throw err;
        }));
    }
    decreaseRequests() {
        this.totalRequests--;
        if (this.totalRequests === 0) {
            this.loadingService.hide();
        }
    }
};
LoaderInterceptor = __decorate([
    Injectable()
], LoaderInterceptor);
export { LoaderInterceptor };
//# sourceMappingURL=loader-interceptor.js.map