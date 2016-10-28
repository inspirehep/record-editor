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

import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { APP_CONFIG } from '../../app.config';

@Injectable()
export class RecordService {
  private type: string;
  private recid: string;
  private config: AppConfig;

  constructor(private http: Http, @Inject(APP_CONFIG) config: AppConfig) {
    this.config = config;
  }

  fetchRecord(type: string, recid: string): Observable<{}> {
    this.type = type;
    this.recid = recid;
    return this.http.get(this.config.api_url(this.type, this.recid))
      .map(res => res.json().metadata);
  }

  fetchSchema(url: string): Observable<{}> {
    return this.http.get(url)
      .map(res => res.json());
  }

  saveRecord(record: Object): Observable<Object> {
    // TO-DO: Check the fields of the record. After calling recordfixer service some required fields are deleted.
    return this.http.put(this.config.api_url(this.type, this.recid), record).map(res => res.json());
  }
}
