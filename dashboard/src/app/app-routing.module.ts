/*
 * Magic Publishing is MIT licensed, copyright Thomas Hansen - thomas@servergardens.com - Se enclosed LICENSE files for terms of use
 */

// Angular core imports.
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Importing components, first "global/common" components.
import { HomeComponent } from './components/home/home.component';
import { AuthComponent } from './components/auth/auth.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FilesComponent } from './components/files/files.component';

// Then importing all "entity components". Basically, the datagrids for viewing entities from your backend.
import { ItemTypesComponent } from './components/item_types/item_types.component';
import { ItemsComponent } from './components/items/items.component';
import { SettingsComponent } from './components/settings/settings.component';
import { TemplatesComponent } from './components/templates/templates.component';


// Creating our routes, one route for each entity type.
const routes: Routes = [

  // First common/global routes.
  { path: '', component: HomeComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'profile', component: ProfileComponent },

  // Then routes for all entity components.
  { path: 'item_types', component: ItemTypesComponent },
  { path: 'items', component: ItemsComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'templates', component: TemplatesComponent },
  { path: 'files', component: FilesComponent },
];

// Declaring our main module.
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
