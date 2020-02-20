/*
 * Magic Publishing is MIT licensed, copyright Thomas Hansen - thomas@servergardens.com - Se enclosed LICENSE files for terms of use
 */

import { __decorate } from "tslib";
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
import { MatDialogModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS } from 'ng-pick-datetime-moment';
import { ChartsModule } from 'ng2-charts';
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
import { SecurityComponent } from './components/security/security.component';
// CRUD wrapper components, both for the datagrid, and its associated editor/creator dialog.
import { Item_typesComponent } from './components/item_types/item_types.component';
import { EditItem_typesComponent } from './components/item_types/modals/edit.item_types.component';
import { ItemsComponent } from './components/items/items.component';
import { EditItemsComponent } from './components/items/modals/edit.items.component';
import { RolesComponent } from './components/roles/roles.component';
import { EditRolesComponent } from './components/roles/modals/edit.roles.component';
import { SettingsComponent } from './components/settings/settings.component';
import { EditSettingsComponent } from './components/settings/modals/edit.settings.component';
import { TemplatesComponent } from './components/templates/templates.component';
import { EditTemplatesComponent } from './components/templates/modals/edit.templates.component';
import { UsersComponent } from './components/users/users.component';
import { EditUsersComponent } from './components/users/modals/edit.users.component';
;
// Helper to retrieve JWT token. Needed for "oauth0".
export function tokenGetter() {
    return localStorage.getItem('jwt_token');
}
// Your main Angular module.
let AppModule = class AppModule {
};
AppModule = __decorate([
    NgModule({
        declarations: [
            AppComponent,
            HomeComponent,
            AuthComponent,
            CreateRoleDialogComponent,
            CreateUserDialogComponent,
            EditUserDialogComponent,
            SecurityComponent,
            FormatDatePipe,
            [[module - declarations]]
        ],
        imports: [
            BrowserModule,
            AppRoutingModule,
            BrowserAnimationsModule,
            HttpClientModule,
            FormsModule,
            ReactiveFormsModule,
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
            MatDatepickerModule,
            MatMomentDateModule,
            OwlDateTimeModule,
            OwlNativeDateTimeModule,
            ChartsModule,
        ],
        providers: [
            LoaderService, {
                provide: HTTP_INTERCEPTORS,
                useClass: LoaderInterceptor,
                multi: true
            },
            {
                provide: OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS,
                useValue: { useUtc: true }
            }
        ],
        bootstrap: [AppComponent],
        entryComponents: [
            CreateRoleDialogComponent,
            CreateUserDialogComponent,
            EditUserDialogComponent,
            [[entry - components]]
        ]
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map