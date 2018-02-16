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
import { Http, Headers } from '@angular/http';

import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';

import { environment } from '../../../environments/environment';
import { AppConfigService } from './app-config.service';
import { CommonApiService } from './common-api.service';
import { Ticket, RecordRevision, RecordResources } from '../../shared/interfaces';
import { ApiError } from '../../shared/classes';
import { editorApiUrl, apiUrl } from '../../shared/config';

@Injectable()
export class RecordApiService extends CommonApiService {

  private currentRecordSaveApiUrl: string;
  private currentRecordEditorApiUrl: string;
  private currentRecordId: string;

  private readonly returnOnlyIdsHeaders = new Headers({ Accept: 'application/vnd+inspire.ids+json' });

  readonly newRecordFetched$ = new ReplaySubject<void>(1);

  constructor(protected http: Http) {
    super(http);
  }

  fetchRecordResources(pidType: string, pidValue: string): Observable<RecordResources> {
    if (this.currentRecordEditorApiUrl) {
      this.unlockRecord();
    }
    this.currentRecordId = pidValue;
    this.currentRecordSaveApiUrl = `${apiUrl}/${pidType}/${pidValue}/db`;
    this.currentRecordEditorApiUrl = `${editorApiUrl}/${pidType}/${pidValue}`;
    // TODO: remove this side effect when every action done in resolvers
    this.newRecordFetched$.next(null);
    return this.http
      .get(this.currentRecordEditorApiUrl)
      .map(res => res.json())
      .catch(error => Observable.throw(new ApiError(error)));

  }

  saveRecord(record: object): Observable<void> {
    return this.http
      .put(this.currentRecordSaveApiUrl, record)
      .catch(error => Observable.throw(new ApiError(error)));
  }

  lockRecord() {
    this.http
      .post(`${this.currentRecordEditorApiUrl}/lock/lock`, null)
      .subscribe();
  }

  unlockRecord() {
    this.http
      .post(`${this.currentRecordEditorApiUrl}/lock/unlock`, null)
      .subscribe();
  }

  fetchRecordTickets(): Observable<Array<Ticket>> {
    return this.http
      .get(`${this.currentRecordEditorApiUrl}/rt/tickets`)
      .map(res => res.json());
  }

  createRecordTicket(ticket: Ticket): Promise<{ id: string, link: string }> {
    return this.http
      .post(`${this.currentRecordEditorApiUrl}/rt/tickets/create`, ticket)
      .map(res => res.json().data)
      .toPromise();
  }

  resolveTicket(ticketId: string): Promise<any> {
    return this.http
      .get(`${this.currentRecordEditorApiUrl}/rt/tickets/${ticketId}/resolve`)
      .toPromise();
  }

  fetchRTUsers(): Observable<Array<string>> {
    return this.http
      .get(`${editorApiUrl}/rt/users`)
      .map(res => res.json())
      .map((users: Array<{ name: string }>) => users.map(user => user.name));
  }

  fetchRTQueues(): Observable<Array<string>> {
    return this.http
      .get(`${editorApiUrl}/rt/queues`)
      .map(res => res.json())
      .map((queues: Array<{ name: string }>) => queues.map(queue => queue.name));
  }

  fetchRevisions(): Observable<Array<RecordRevision>> {
    return this.http
      .get(`${this.currentRecordEditorApiUrl}/revisions`)
      .map(res => res.json());
  }

  fetchRevisionData(transactionId: number, recUUID: string): Promise<Object> {
    return this.http
      .get(`${this.currentRecordEditorApiUrl}/revision/${recUUID}/${transactionId}`)
      .map(res => res.json())
      .toPromise();
  }

  revertToRevision(revisionId: number): Promise<void> {
    return this.http
      .put(`${this.currentRecordEditorApiUrl}/revisions/revert`, { revision_id: revisionId })
      .map(res => res.json())
      .toPromise();
  }

  searchRecord(recordType: string, query: string): Observable<Array<number>> {
    return this.http
      .get(`${apiUrl}/${recordType}/?q=${query}&size=200`, { headers: this.returnOnlyIdsHeaders })
      .map(res => res.json())
      .map(json => json.hits.recids)
      .catch(error => Observable.throw(new ApiError(error)));
  }

  preview(record: object): Promise<string> {
    return this.http
      .post(`${environment.baseUrl}/editor/preview`, record)
      .map(response => response.text())
      .toPromise();
  }

  manualMerge(updateRecordId: string): Observable<number> {
    const body = {
      head_recid: this.currentRecordId,
      update_recid: updateRecordId
    };
    return this.http
      .post(`${editorApiUrl}/manual_merge`, body)
      .map(res => res.json())
      .map(json => json.workflow_object_id);
  }

}
