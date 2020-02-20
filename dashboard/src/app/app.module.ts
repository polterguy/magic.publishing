/*
 * Magic Publishing is MIT licensed, copyright Thomas Hansen - thomas@servergardens.com - Se enclosed LICENSE files for terms of use
 */

 // Common imports from Angular ++.
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Material imports.
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ChartsModule } from 'ng2-charts';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';

// Importing "oauth0" to help out with our JWT tokens.
import { JwtModule } from '@auth0/angular-jwt';

// Routing, services, etc imports.
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoaderService } from './services/loader-service';
import { LoaderInterceptor } from './services/loader-interceptor';
import { FormatDatePipe } from './pipes/format-date-pipe';
import { environment } from 'src/environments/environment';

// All components. First all "global" components.
import { HomeComponent } from './components/home/home.component';
import { AuthComponent } from './components/auth/auth.component';
import { CreateRoleDialogComponent } from './components/auth/modals/create-role-dialog';
import { CreateUserDialogComponent } from './components/auth/modals/create-user-dialog';
import { EditUserDialogComponent } from './components/auth/modals/edit-user-dialog';
import { ProfileComponent } from './components/profile/profile.component';

// CRUD wrapper components, both for the datagrid, and its associated editor/creator dialog.
import { ItemTypesComponent } from './components/item_types/item_types.component';
import { EditItem_typesComponent } from './components/item_types/modals/edit.item_types.component';
import { ItemsComponent } from './components/items/items.component';
import { EditItemsComponent } from './components/items/modals/edit.items.component';
import { SettingsComponent } from './components/settings/settings.component';
import { EditSettingsComponent } from './components/settings/modals/edit.settings.component';
import { TemplatesComponent } from './components/templates/templates.component';
import { EditTemplatesComponent } from './components/templates/modals/edit.templates.component';
import { MarkedPipe } from './pipes/marked.pipe';


// Helper to retrieve JWT token. Needed for "oauth0".
export function tokenGetter() {
  return localStorage.getItem('jwt_token');
}

// Your main Angular module.
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AuthComponent,
    CreateRoleDialogComponent,
    CreateUserDialogComponent,
    EditUserDialogComponent,
    ProfileComponent,
    FormatDatePipe,
    ItemTypesComponent,
    EditItem_typesComponent,
    ItemsComponent,
    EditItemsComponent,
    SettingsComponent,
    EditSettingsComponent,
    TemplatesComponent,
    EditTemplatesComponent,
    MarkedPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CodemirrorModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        whitelistedDomains: [environment.apiDomain],
      }
    }),
    MatButtonModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatTableModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatMomentDateModule,
    ChartsModule,
  ],
  providers: [
    LoaderService, {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    CreateRoleDialogComponent,
    CreateUserDialogComponent,
    EditUserDialogComponent,
    EditItem_typesComponent,
    EditItemsComponent,
    EditSettingsComponent,
    EditTemplatesComponent,
  ]
})
export class AppModule { }
