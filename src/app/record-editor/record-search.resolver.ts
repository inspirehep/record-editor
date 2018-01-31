/*
 * This file is part of record-editor.
 * Copyright (C) 2018 CERN.
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

import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RecordApiService, RecordSearchService } from '../core/services';
import { RecordResources } from '../shared/interfaces';
import { ApiError } from '../shared/classes';

@Injectable()
export class RecordSearchResolver implements Resolve<string> {

  constructor(private router: Router,
    private apiService: RecordApiService,
    private recordSearchService: RecordSearchService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<string> {
    const recordType = route.params.type;
    const query = route.queryParams.query;
    let cursor = Number(route.queryParams.cursor);

    return this.recordSearchService
      .search(recordType, query)
      .filter(foundIds => foundIds.length > 0)
      .do(foundIds => {
        if (!cursor || cursor >= foundIds.length || cursor < 0) {
          cursor = 0;
        }
      })
      .map(foundIds => String(foundIds[cursor]))
      .catch((error: ApiError) => {
        this.router.navigate(['error', error.status]);
        return null;
      });
  }
}
