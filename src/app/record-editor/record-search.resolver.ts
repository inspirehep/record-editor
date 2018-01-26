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

import { RecordResourcesResolver } from './record-resources.resolver';
import { RecordSearchService } from '../core/services';
import { RecordResources } from '../shared/interfaces';
import { ApiError } from '../shared/classes';

@Injectable()
export class RecordSearchResolver implements Resolve<Array<number>> {
  constructor(private router: Router,
    private recordSearchService: RecordSearchService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Array<number>> {
    if (!route.queryParams.query) {
      return Observable.of([]);
    }

    return this.recordSearchService
      .search(route.params.type, route.queryParams.query)
      .take(1)
      .catch((error: ApiError) => {
        this.router.navigate(['error', error.status]);
        return null;
      });
  }
}
