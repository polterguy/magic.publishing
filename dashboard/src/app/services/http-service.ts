/*
 * Magic Publishing is MIT licensed, copyright Thomas Hansen - thomas@servergardens.com - Se enclosed LICENSE files for terms of use
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

/*
 * Your main HTTP service for invoking CRUD methods in your backend's API.
 *
 * Notice, also contains some "helper methods" such as authenticate, refresh JWT token, etc.
 */
@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpClient: HttpClient) { }

  // Authenticates you towards your backend API.
  authenticate(username: string, password: string) {
    return this.httpClient.get<any>(
      environment.apiUrl +
      'magic/modules/system/auth/authenticate?username=' +
      encodeURI(username) +
      '&password=' +
      encodeURI(password));
  }

  // Will refresh an existing JWT token, if possible.
  refreshTicket() {
    return this.httpClient.get<any>(environment.apiUrl + 'magic/modules/system/auth/refresh-ticket');
  }

  // Will refresh an existing JWT token, if possible.
  changeMyPassword(password: string) {
    return this.httpClient.put<any>(environment.apiUrl + 'magic/modules/system/auth/change-password', {
      password,
    });
  }

  // Creates QUERY arguments from the specified "args" argument given.
  getQueryArgs(args: any) {
    let result = '';
    for(const idx in args) {
      if (Object.prototype.hasOwnProperty.call(args, idx)) {
        const idxFilter = args[idx];
        if (idxFilter !== null && idxFilter !== undefined && idxFilter !== '') {
          if (result === '') {
            result += '?';
          } else {
            result += '&';
          }
          if (idx.endsWith('.like')) {
            result += idx + '=' + encodeURIComponent(idxFilter + '%');
          } else {
            result += idx + '=' + encodeURIComponent(idxFilter);
          }
        }
      }
    }
    return result;
  }

  // HTTP REST methods your backend exposes, and that was used to scaffold Angular frontend app.


  item_types_Delete(args: any) {
    return this.httpClient.delete<any>(environment.apiUrl + 'magic/modules/magic/item_types' + this.getQueryArgs(args));
  }

  item_types_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl + 'magic/modules/magic/item_types' + this.getQueryArgs(args));
  }

  item_types_Post(args: any) {
    return this.httpClient.post<any>(environment.apiUrl + 'magic/modules/magic/item_types', args);
  }

  item_types_Put(args: any) {
    return this.httpClient.put<any>(environment.apiUrl + 'magic/modules/magic/item_types', args);
  }

  item_types_count_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl + 'magic/modules/magic/item_types-count' + this.getQueryArgs(args));
  }

  items_Delete(args: any) {
    return this.httpClient.delete<any>(environment.apiUrl + 'magic/modules/magic/items' + this.getQueryArgs(args));
  }

  items_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl + 'magic/modules/magic/items' + this.getQueryArgs(args));
  }

  items_Post(args: any) {
    return this.httpClient.post<any>(environment.apiUrl + 'magic/modules/magic/items', args);
  }

  items_Put(args: any) {
    return this.httpClient.put<any>(environment.apiUrl + 'magic/modules/magic/items', args);
  }

  items_count_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl + 'magic/modules/magic/items-count' + this.getQueryArgs(args));
  }

  settings_Delete(args: any) {
    return this.httpClient.delete<any>(environment.apiUrl + 'magic/modules/magic/settings' + this.getQueryArgs(args));
  }

  settings_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl + 'magic/modules/magic/settings' + this.getQueryArgs(args));
  }

  settings_Post(args: any) {
    return this.httpClient.post<any>(environment.apiUrl + 'magic/modules/magic/settings', args);
  }

  settings_Put(args: any) {
    return this.httpClient.put<any>(environment.apiUrl + 'magic/modules/magic/settings', args);
  }

  settings_count_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl + 'magic/modules/magic/settings-count' + this.getQueryArgs(args));
  }

  templates_Delete(args: any) {
    return this.httpClient.delete<any>(environment.apiUrl + 'magic/modules/magic/templates' + this.getQueryArgs(args));
  }

  templates_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl + 'magic/modules/magic/templates' + this.getQueryArgs(args));
  }

  templates_Post(args: any) {
    return this.httpClient.post<any>(environment.apiUrl + 'magic/modules/magic/templates', args);
  }

  templates_Put(args: any) {
    return this.httpClient.put<any>(environment.apiUrl + 'magic/modules/magic/templates', args);
  }

  templates_count_Get(args: any) {
    return this.httpClient.get<any>(environment.apiUrl + 'magic/modules/magic/templates-count' + this.getQueryArgs(args));
  }
}
