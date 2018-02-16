import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { JsonEditorWrapperComponent } from './json-editor-wrapper';
import { RecordResourcesResolver } from './record-resources.resolver';
import { RecordSearchResolver } from './record-search.resolver';
import { RecordTicketsResolver } from './record-tickets.resolver';

const recordEditorRoutes: Routes = [
  {
    path: ':type/search',
    resolve: { foundRecordId: RecordSearchResolver },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    children: [
      {
        path: '',
        component: JsonEditorWrapperComponent,
        resolve: {
          resources: RecordResourcesResolver,
          tickets: RecordTicketsResolver
        },
        runGuardsAndResolvers: 'paramsOrQueryParamsChange'
      }
    ]
  },
  {
    path: ':type/:recid',
    component: JsonEditorWrapperComponent,
    resolve: {
      resources: RecordResourcesResolver,
      tickets: RecordTicketsResolver
    }
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
    RecordSearchResolver,
    RecordTicketsResolver
  ]
})
export class RecordEditorRouter { }
