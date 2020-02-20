/*
 * Magic Publishing is MIT licensed, copyright Thomas Hansen - thomas@servergardens.com - Se enclosed LICENSE files for terms of use
 */

import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
/*
 * Your main HTTP service for invoking CRUD methods in your backend's API.
 *
 * Notice, also contains some "helper methods" such as authenticate, refresh JWT token, etc.
 */
let HttpService = class HttpService {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }
    // Authenticates you towards your backend API.
    authenticate(username, password) {
        return this.httpClient.get(environment.apiUrl +
            'magic/modules/system/auth/authenticate?username=' +
            encodeURI(username) +
            '&password=' +
            encodeURI(password));
    }
    // Will refresh an existing JWT token, if possible.
    refreshTicket() {
        return this.httpClient.get(environment.apiUrl + 'magic/modules/system/auth/refresh-ticket');
    }
    // Will refresh an existing JWT token, if possible.
    changeMyPassword(password) {
        return this.httpClient.put(environment.apiUrl + 'magic/modules/system/auth/change-password', {
            password,
        });
    }
    // Creates QUERY arguments from the specified "args" argument given.
    getQueryArgs(args) {
        let result = '';
        for (const idx in args) {
            if (Object.prototype.hasOwnProperty.call(args, idx)) {
                const idxFilter = args[idx];
                if (idxFilter !== null && idxFilter !== undefined && idxFilter !== '') {
                    if (result === '') {
                        result += '?';
                    }
                    else {
                        result += '&';
                    }
                    if (idx.endsWith('.like')) {
                        result += idx + '=' + encodeURIComponent(idxFilter + '%');
                    }
                    else {
                        result += idx + '=' + encodeURIComponent(idxFilter);
                    }
                }
            }
        }
        return result;
    }
};
[http - client - service - method - implementations];
HttpService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], HttpService);
export { HttpService };
//# sourceMappingURL=http-service.js.map