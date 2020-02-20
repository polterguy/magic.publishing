/*
 * Magic Publishing is MIT licensed, copyright Thomas Hansen - thomas@servergardens.com - Se enclosed LICENSE files for terms of use
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {
  transform(value: any, args: string[] = null): any {
    const date = new Date(value);
    return date.toLocaleString();
  }
}
