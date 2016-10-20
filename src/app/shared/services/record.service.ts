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

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class RecordService {
  private type: string;
  private recid: string;

  constructor(private http: Http) { }

  fetchRecord(type: string, recid: string): Observable<{}> {
    // TODO: change base url!
    this.type = type;
    this.recid = recid;
    return this.http.get(`http://localhost:5000/api/${type}/${recid}/db`)
      .map(res => res.json().metadata);
  }

  fetchSchema(url: string): Observable<{}> {
    return this.http.get(url)
      .map(res => res.json());
  }

  saveRecord(record: Object): Observable<Object> {
    let postData = {
      'pid_type': this.type,
      'recid': this.recid,
      'json_data': record
    };
    return this.http.post('http://localhost:5000/editor/save', postData).map(res => res.json());
  }
}
