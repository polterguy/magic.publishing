/*
 * Magic Publishing is MIT licensed, copyright Thomas Hansen - thomas@servergardens.com - Se enclosed LICENSE files for terms of use
 */

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpService } from 'src/app/services/http-service';
import { JwtHelperService } from '@auth0/angular-jwt';

/*
 * Input data to dialog.
 * Notice, if dialog is instantiated in "create entity mode", the
 * entity property will be an empty object, with no fields.
 */
export interface DialogData {
  isEdit: boolean;
  entity: any;
}

/*
 * Modal dialog for editing your existing Items entity types, and/or
 * creating new entity types.
 */
@Component({
  templateUrl: './edit.items.component.html',
  styleUrls: ['./edit.items.component.scss']
})
export class EditItemsComponent implements OnInit {

  /*
   * Only the following properties of the given data.entity will actually
   * be transmitted to the server when we create records. This is done to
   * make sure we don't submit "automatic" primary key values.
   */
  private createColumns: string[] = ['url', 'author', 'template', 'item_type', 'title', 'content'];
  private updateColumns: string[] = ['id', 'url', 'author', 'template', 'item_type', 'title', 'content'];
  private primaryKeys: string[] = ['id'];
  public shouldShow = false;
  public templates: any[] = [];
  public types: any[] = [];

  /*
   * Constructor taking a bunch of services injected using dependency injection.
   */
  constructor(
    public dialogRef: MatDialogRef<EditItemsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private snackBar: MatSnackBar,
    private jwtHelper: JwtHelperService,
    private service: HttpService) { }

  ngOnInit() {

    // Hack necessary to make sure CodeMirror functions correctly (due to animations).
    setTimeout(() => { this.shouldShow = true; }, 200);

    // Retrieving all templates in system.
    this.service.templates_Get({}).subscribe(res => {
      this.templates = res;
      if (!this.data.isEdit) {
        this.data.entity.template = this.templates[0].name;
      }
    });
    this.service.item_types_Get({}).subscribe(res => {
      this.types = res;
      if (!this.data.isEdit) {
        this.data.entity.item_type = this.types[0].name;
      }
    });
    if (!this.data.isEdit) {
      const token = this.jwtHelper.decodeToken(localStorage.getItem('jwt_token'));
      this.data.entity.author = token.unique_name;
    }
  }

  canEditColumn(name: string) {
    if (this.data.isEdit) {
      return this.updateColumns.filter(x => x === name).length > 0 &&
        this.primaryKeys.filter(x => x === name).length === 0;
    }
    return this.createColumns.filter(x => x === name).length > 0;
  }

  titleChanged() {
    if (!this.data.isEdit) {
      if (this.data.entity.url === undefined || this.data.entity.url === null || this.data.entity.url === '') {
        let url: string = this.data.entity.title.toLowerCase();
        url = url.split(' ').join('-');
        url = url.replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, '-');
        while (url.indexOf('--') >= 0) {
          url = url.split('--').join('-');
        }
        if (url.startsWith('-')) {
          url = url.substring(1);
        }
        if (url.endsWith('-')) {
          url = url.substring(0, url.length - 1);
        }
        this.data.entity.url = url;
      }
    }
  }

  /*
   * Invoked when the user clicks the "Save" button.
   */
  save() {

    /*
     * Checking if we're editing an existing entity type, or if we're
     * creating a new instance.
     */
    if (this.data.isEdit) {

      /*
       * Removing all columns that we're not supposed to transmit during "edit mode".
       */
      for (const idx in this.data.entity) {
        if (this.updateColumns.indexOf(idx) === -1) {
          delete this.data.entity[idx];
        }
      }

      // Updating existing item. Invoking update HTTP REST endpoint and closing dialog.
      this.service.items_Put(this.data.entity).subscribe(res => {
        this.dialogRef.close(this.data.entity);
        if (res['updated-records'] !== 1) {

          // Oops, error!
          this.snackBar.open(`Oops, number of items was ${res['updated-records']}, which is very wrong. Should have been 1`, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        }
      }, error => {

        // Oops, error!
        this.snackBar.open(error.error.message, 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      });
    } else {

      /*
       * Removing all columns that we're not supposed to transmit during "create mode".
       */
      for (const idx in this.data.entity) {
        if (this.createColumns.indexOf(idx) === -1) {
          delete this.data.entity[idx];
        }
      }

      // Creating new item. Invoking create HTTP REST endpoint and closing dialog.
      this.service.items_Post(this.data.entity).subscribe(res => {
        this.dialogRef.close(this.data.entity);

        if (res === null || res === undefined) {
          // Oops, error!
          this.snackBar.open(`Oops, for some reasons backend returned ${res}, which seems to be very wrong!`, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        }
      }, error => {

        // Oops, error!
        this.snackBar.open(error.error.message, 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      });
    }
  }

  // Invoked when user cancels edit/create operation.
  cancel() {
    this.dialogRef.close();
  }
}
