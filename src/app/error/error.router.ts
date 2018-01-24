import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { NotFoundComponent } from './not-found';
import { ForbiddenComponent } from './forbidden';
import { LockedComponent } from './locked';
import { InternalServerErrorComponent } from './internal-server-error';

const errorRoutes: Routes = [
  { path: '', redirectTo: '404' },
  { path: '403', component: ForbiddenComponent },
  { path: '404', component: NotFoundComponent },
  { path: '423', component: LockedComponent },
  { path: '500', component: InternalServerErrorComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(errorRoutes)
  ],
  exports: [
    RouterModule,
  ]
})
export class ErrorRouter { }
