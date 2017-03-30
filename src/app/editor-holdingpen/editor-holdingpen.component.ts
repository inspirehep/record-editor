/*
 * This file is part of record-editor.
 * Copyright (C) 2016 CERN.
 *
 * record-editor is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 2 of the
 * License, or (at your option) any later version.
 *
 * record-editor is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with record-editor; if not, write to the Free Software Foundation, Inc.,
 * 59 Temple Place, Suite 330, Boston, MA 02111-1307, USA.
 * In applying this license, CERN does not
 * waive the privileges and immunities granted to it by virtue of its status
 * as an Intergovernmental Organization or submit itself to any jurisdiction.
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import 'rxjs/add/operator/mergeMap';

import { ApiService } from '../shared/services';
import { AppConfigService } from '../app-config.service';

@Component({
  templateUrl: './editor-holdingpen.component.html',
  styleUrls: [
    './editor-holdingpen.component.scss'
  ]
})
export class EditorHoldingPenComponent implements OnInit {
  private workflowObject: Object;
  private schema: Object;
  private config: Object;

  constructor(private route: ActivatedRoute,
    private apiService: ApiService,
    private appConfig: AppConfigService) { }

  ngOnInit() {
    this.route.params
      .subscribe(params => {
        this.apiService.fetchWorkflowObject(params['objectid'])
          .then(workflowObject => {
            this.workflowObject = workflowObject;
            window.onbeforeunload = () => {
              this.apiService.saveDataLocally(this.workflowObject);
            };
            this.config = this.appConfig.getConfigForRecord(this.workflowObject['metadata']);
            return this.apiService.fetchUrl(this.workflowObject['metadata']['$schema']);
          }).then(schema => {
            this.schema = schema;

          }).catch(error => console.error(error));
      });

  }

  onRecordChange(record: Object) {
    this.workflowObject['metadata'] = record;
  }
}
