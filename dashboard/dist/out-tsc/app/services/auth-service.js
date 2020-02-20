/*
 * Magic Publishing is MIT licensed, copyright Thomas Hansen - thomas@servergardens.com - Se enclosed LICENSE files for terms of use
 */

import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
/*
 * Filter for invoking "auth" methods, allowing you to filter users/roles/etc.
 */
export class AuthFilter {
}
/*
 * Authentication and authorization service, allowing you to query your backend
 * for its users/roles/etc.
 */
let AuthService = class AuthService {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }
    // Returns all users according to the specified filter condition.
    getUsers(filter = null) {
        let query = '';
        if (filter !== null) {
            query += '?limit=' + filter.limit;
            query += "&offset=" + filter.offset;
            if (filter.filter !== null && filter.filter !== undefined && filter.filter != '') {
                query += '&username.like=' + encodeURIComponent(filter.filter + '%');
            }
        }
        return this.httpClient.get(environment.apiUrl +
            'magic/modules/magic_auth/users' + query);
    }
    // Returns count of users according to the specified filter condition.
    getUsersCount(filter = null) {
        let query = '';
        if (filter !== null) {
            query += '?username.like=' + encodeURIComponent(filter + '%');
        }
        return this.httpClient.get(environment.apiUrl +
            'magic/modules/magic_auth/users-count' + query);
    }
    // Returns all roles according to the specified filter condition.
    getRoles(filter = null) {
        let query = '';
        if (filter !== null) {
            query += '?limit=' + filter.limit;
            query += "&offset=" + filter.offset;
            if (filter.filter !== null && filter.filter !== undefined && filter.filter != '') {
                query += '&name.like=' + encodeURIComponent(filter.filter + '%');
            }
        }
        return this.httpClient.get(environment.apiUrl +
            'magic/modules/magic_auth/roles' + query);
    }
    // Returns count of roles according to the specified filter condition.
    getRolesCount(filter = null) {
        let query = '';
        if (filter !== null) {
            query += '?name.like=' + encodeURIComponent(filter + '%');
        }
        return this.httpClient.get(environment.apiUrl +
            'magic/modules/magic_auth/roles-count' + query);
    }
    // Creates a new user.
    createUser(username, password) {
        return this.httpClient.post(environment.apiUrl + 'magic/modules/magic_auth/users', {
            username,
            password,
        });
    }
    // Creates a new role.
    createRole(name, description) {
        return this.httpClient.post(environment.apiUrl + 'magic/modules/magic_auth/roles', {
            name,
            description,
        });
    }
    // Deletes an existing user.
    deleteUser(username) {
        return this.httpClient.delete(environment.apiUrl +
            'magic/modules/magic_auth/users?username=' + encodeURIComponent(username));
    }
    // Deletes an existing role.
    deleteRole(name) {
        return this.httpClient.delete(environment.apiUrl +
            'magic/modules/magic_auth/roles?name=' + encodeURIComponent(name));
    }
    // Returns all roles that the specified user belongs to.
    getUserRoles(username) {
        return this.httpClient.get(environment.apiUrl +
            'magic/modules/magic_auth/users_roles?user.eq=' + encodeURIComponent(username));
    }
    // Adds a specified user to a specified role.
    addRoleToUser(user, role) {
        return this.httpClient.post(environment.apiUrl + 'magic/modules/magic_auth/users_roles', {
            user,
            role,
        });
    }
    // Removes a role fomr a user.
    deleteRoleFromUser(user, role) {
        return this.httpClient.delete(environment.apiUrl +
            'magic/modules/magic_auth/users_roles?role=' + encodeURIComponent(role) +
            '&user=' + encodeURIComponent(user));
    }
};
AuthService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], AuthService);
export { AuthService };
//# sourceMappingURL=auth-service.js.map