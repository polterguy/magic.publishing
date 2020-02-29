
import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileService } from '../../services/file-service';
import { MatDialog } from '@angular/material/dialog';
import { NewFileDialogComponent } from './modals/new-file-dialog';
import { ConfirmDeletionDialogComponent } from './modals/confirm-deletion-dialog';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {

  public dataSource: any[] = [];
  public displayedColumns: string[] = ['path', 'download', 'delete'];
  public displayedSecondRowColumns: string[] = ['details'];
  public path = '/';
  public filter = '';

  constructor(
    private fileService: FileService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.fileService.vocabulary().subscribe((res) => {
      localStorage.setItem('vocabulary', JSON.stringify(res));
    });
    this.getPath();
  }

  getPath() {
    this.fileService.listFiles(this.path).subscribe(files => {
      this.fileService.listFolders(this.path).subscribe(folders => {
        this.dataSource = (folders || []).concat(files || []).map(x => {
          return {
            path: x,
            extra: null,
          };
        });
      });
    });
  }

  getFilterPlaceholderText() {
    return `Filter '${this.path}' for files ...`;
  }

  getFilteredDatasource() {
    if (this.filter === '') {
      return this.dataSource;
    }
    return this.dataSource.filter(x => {
      const entities = x.path.split('/');
      const filename = entities[entities.length - 1];
      return filename.indexOf(this.filter) !== -1;
    });
  }

  downloadFile(path: string) {
    this.fileService.downloadFile(path);
  }

  deletePath(el: any) {
    const dialogRef = this.dialog.open(ConfirmDeletionDialogComponent, {
      width: '500px',
      data: {
        path: el.path
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res !== undefined) {
        if (el.path.endsWith('/')) {
          this.fileService.deleteFolder(el.path).subscribe(res2 => {
            this.showInfo('Folder was successfully deleted');
            this.getPath();
          });
        } else {
          this.fileService.deleteFile(el.path).subscribe(res2 => {
            this.showInfo('File was successfully deleted');
            el.extra = null;
            this.getPath();
          });
        }
      }
    });
  }

  getFileName(el: string) {
    if (el.endsWith('/')) {
      const result = el.substr(0, el.length - 1);
      return result.substr(result.lastIndexOf('/') + 1);
    }
    return el.substr(el.lastIndexOf('/') + 1);
  }

  selectPath(el: any) {
    if (el.path.endsWith('/')) {
      this.path = el.path;
      this.getPath();
    } else {
      if (el.extra !== null) {
        el.extra = null; // Toggling visibility ...
        return;
      }
      const mode = this.getMode(el);
      if (mode == null) {
        this.showError('No editor registered for file. Download and edit locally.');
      } else {
        this.openFile(el);
      }
    }
  }

  createNewFile() {
    const dialogRef = this.dialog.open(NewFileDialogComponent, {
      width: '500px',
      data: {
        path: '',
        header: 'New file'
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res !== undefined) {
        this.createFile(res);
      }
    });
  }

  createNewFolder() {
    const dialogRef = this.dialog.open(NewFileDialogComponent, {
      width: '500px',
      data: {
        path: '',
        header: 'New folder'
      }
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res !== undefined) {
        this.createFolder(res);
      }
    });
  }

  createFile(filename: string) {
    if (filename === '') {
      this.showError('You have to give your filename a name');
    } else if (filename.indexOf('.') === -1) {
      this.showError('Your file needs an extension, such as ".hl" or something');
    } else {
      this.fileService.saveFile(this.path + filename, '/* Initial content */').subscribe((res) => {
        this.showInfo('File successfully created');
        this.getPath();
      }, (error) => {
        this.showError(error.error.message);
      });
    }
  }

  createFolder(foldername: string) {
    if (foldername === '') {
      this.showError('You have to give your folder a name');
    } else {
      const letters = /^[0-9a-z]+$/;
      if (!letters.test(foldername)) {
        this.showError('A Folder can only have the characters [a-z] and [0-1] in its name');
      } else {
        this.fileService.createFolder(this.path + foldername).subscribe((res) => {
          this.showInfo('Folder successfully created');
          this.getPath();
        }, (error) => {
          this.showError(error.error.message);
        });
      }
    }
  }

  upOneFolder() {
    const splits = this.path.split('/');
    splits.splice(-2, 1);
    this.path = splits.join('/');
    this.getPath();
    this.filter = '';
    return false;
  }

  openFile(el: any) {
    this.fileService.getFileContent(el.path).subscribe(res => {
      el.extra = {
        fileContent: res,
      };
    }, error => {
      this.showError(error.error.message);
    });
  }

  getCodeMirrorOptions(el: any) {
    const result = {
      lineNumbers: true,
      theme: 'material',
      mode: this.getMode(el),
      tabSize: 3,
      indentUnit: 3,
      indentAuto: true,
      extraKeys: {
        'Shift-Tab': 'indentLess',
        Tab: 'indentMore',
      }
    };
    if (this.getMode(el) === 'hyperlambda') {
      result.extraKeys['Ctrl-Space'] = 'autocomplete';
    }
    return result;
  }

  getMode(el: any) {
    const fileEnding = el.path.substr(el.path.lastIndexOf('.') + 1);
    switch (fileEnding.toLowerCase()) {
      case 'hl':
        return 'hyperlambda';
      case 'md':
        return 'markdown';
      case 'js':
        return 'application/jsx';
      case 'css':
        return 'text/css';
      case 'sql':
        return 'text/x-mysql';
      case 'json':
        return 'application/ld+json';
      case 'ts':
        return 'text/typescript';
      case 'htm':
      case 'html':
        return 'text/html';
      case 'scss':
        return 'text/x-scss';
      default:
        return null;
    }
  }

  handleFileInput(files: FileList) {
    for (let idx = 0; idx < files.length; idx++) {
      this.fileService.uploadFile(this.path, files.item(idx)).subscribe(res => {
        this.showInfo('File was successfully uploaded');
        this.getPath();
      });
    }
  }

  canExecute(el: any) {
    return el.path.endsWith('.hl');
  }

  execute(el: any) {
    this.fileService.evaluate(el.extra.fileContent).subscribe(res => {
      this.showInfo('File evaluated successfully');
    }, err => {
      this.showError(err.error.message);
    });
  }

  save(el: any) {
    this.fileService.saveFile(el.path, el.extra.fileContent).subscribe(res => {
      this.showInfo('File successfully saved');
    }, (error) => {
      this.showError(error.error.message);
    });
    return false;
  }

  close(el: any) {
    el.extra = null;
  }

  isFolder(path: string) {
    return path.endsWith('/');
  }

  getClassForDetails(el: any) {
    if (el.extra === null || el.extra.fileContent === null) {
      return 'invisible';
    }
    return 'editor-visible';
  }

  atRoot() {
    return this.path === '/';
  }

  showInfo(info: string) {
    this.snackBar.open(info, 'Close', {
      duration: 2000
    });
  }

  showError(error: string) {
    this.snackBar.open(error, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
  }
}
