/*
 * Magic Publishing is MIT licensed, copyright Thomas Hansen - thomas@servergardens.com - Se enclosed LICENSE files for terms of use
 */

import { __decorate } from "tslib";
import { Pipe } from '@angular/core';
let FormatDatePipe = class FormatDatePipe {
    transform(value, args) {
        const date = new Date(value);
        return date.toLocaleString();
    }
};
FormatDatePipe = __decorate([
    Pipe({
        name: 'formatDate'
    })
], FormatDatePipe);
export { FormatDatePipe };
//# sourceMappingURL=format-date-pipe.js.map