import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

import { AdminApiEndpoints } from '../../../../core/api/admin-api-endpoints';
import { OverviewDashboardResponse, OverviewFilter } from '../models/overview.model';
import { buildOverviewMock } from './overview-mock.data';

@Injectable({ providedIn: 'root' })
export class OverviewApiService {
  readonly endpoints = AdminApiEndpoints;

  getOverview(filter: OverviewFilter): Observable<OverviewDashboardResponse> {
    return of(buildOverviewMock(filter.period)).pipe(delay(300));
  }
}
