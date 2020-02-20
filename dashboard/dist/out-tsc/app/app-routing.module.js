/*
 * Magic Publishing is MIT licensed, copyright Thomas Hansen - thomas@servergardens.com - Se enclosed LICENSE files for terms of use
 */

import { __decorate } from "tslib";
// Angular core imports.
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
// Importing components, first "global/common" components.
import { HomeComponent } from './components/home/home.component';
import { AuthComponent } from './components/auth/auth.component';
import { SecurityComponent } from './components/security/security.component';
// Then importing all "entity components". Basically, the datagrids for viewing entities from your backend.
[[imports - only - main]];
// Creating our routes, one route for each entity type.
const routes = [
    // First common/global routes.
    { path: '', component: HomeComponent },
    { path: 'auth', component: AuthComponent },
    { path: 'security', component: SecurityComponent },
    // Then routes for all entity components.
      { path: 'item_types', component: Item_typesComponent },
  { path: 'items', component: ItemsComponent },
  { path: 'roles', component: RolesComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'templates', component: TemplatesComponent },
  { path: 'users', component: UsersComponent },

];
// Declaring our main module.
let AppRoutingModule = class AppRoutingModule {
};
AppRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forRoot(routes)],
        exports: [RouterModule]
    })
], AppRoutingModule);
export { AppRoutingModule };
//# sourceMappingURL=app-routing.module.js.map