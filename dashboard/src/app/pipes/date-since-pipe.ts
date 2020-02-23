/*
 * Magic Publishing is MIT licensed, copyright Thomas Hansen - thomas@servergardens.com - Se enclosed LICENSE files for terms of use
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateSince'
})
export class DateSincePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (value) {
      const now = new Date();
      const input = new Date(value);
      let seconds = Math.floor((+now - +input) / 1000);
      let side = 'ago';
      if (seconds < 0) {
        side = 'from now';
      }
      if (seconds > 0 && seconds < 29)
        return 'Just now';
      seconds = Math.abs(seconds);
      const intervals = {
        'year': 31536000,
        'month': 2592000,
        'week': 604800,
        'day': 86400,
        'hour': 3600,
        'minute': 60,
        'second': 1
      };
      for (const i in intervals) {
        const counter = Math.floor(seconds / intervals[i]);
        if (counter > 0)
          if (counter === 1) {
              return counter + ' ' + i + ' ' + side;
          } else {
              return counter + ' ' + i + 's ' + side;
          }
      }
    }
    return value;
}}
