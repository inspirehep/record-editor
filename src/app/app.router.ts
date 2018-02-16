import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const appRoutes: Routes = [
  { path: 'holdingpen', loadChildren: './holdingpen-editor/holdingpen-editor.module#HoldingpenEditorModule' },
  { path: 'record', loadChildren: './record-editor/record-editor.module#RecordEditorModule' },
  { path: 'multieditor', loadChildren: './multi-editor/multi-editor.module#MultiEditorModule' },
  { path: 'error', loadChildren: './error/error.module#ErrorModule' },
  { path: '**', pathMatch: 'full', redirectTo: 'error' }

];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRouter { }
