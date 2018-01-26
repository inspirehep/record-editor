import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { RecordSearchComponent } from './record-search';
import { JsonEditorWrapperComponent } from './json-editor-wrapper';
import { RecordResourcesResolver } from './record-resources.resolver';
import { RecordSearchResolver } from './record-search.resolver';


const recordEditorRoutes: Routes = [
  {
    path: ':type/search',
    component: RecordSearchComponent,
    resolve: { recids: RecordSearchResolver },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange'
  },
  {
    path: ':type/:recid',
    component: JsonEditorWrapperComponent,
    resolve: { resources: RecordResourcesResolver }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(recordEditorRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    RecordResourcesResolver,
    RecordSearchResolver
  ]
})
export class RecordEditorRouter { }
