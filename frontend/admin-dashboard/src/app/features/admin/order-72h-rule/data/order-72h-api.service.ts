import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminApiEndpoints } from '../../../../core/api/admin-api-endpoints';
import {
  ConfirmationOverdueFilter,
  ManualReassignRequest,
  OpenReplacementWindowRequest,
  OpenReplacementWindowResponse,
  OrderExceptionRequest,
  OrderExceptionResponse,
  PaginatedAdminOrder72hResponse,
  ReplacementWindowListResponse,
} from '../models';

/**
 * HTTP layer for F06 admin operations.
 * Wire HttpClient when Angular app is bootstrapped.
 */
@Injectable({ providedIn: 'root' })
export class Order72hApiService {
  readonly endpoints = AdminApiEndpoints;

  getConfirmationOverdue(
    _filter: ConfirmationOverdueFilter
  ): Observable<PaginatedAdminOrder72hResponse> {
    throw new Error('Order72hApiService.getConfirmationOverdue — not implemented');
  }

  getReplacementWindows(): Observable<ReplacementWindowListResponse> {
    throw new Error('Order72hApiService.getReplacementWindows — not implemented');
  }

  openReplacementWindow(
    _orderId: string,
    _request: OpenReplacementWindowRequest
  ): Observable<OpenReplacementWindowResponse> {
    throw new Error('Order72hApiService.openReplacementWindow — not implemented');
  }

  manualReassign(
    _orderId: string,
    _request: ManualReassignRequest
  ): Observable<void> {
    throw new Error('Order72hApiService.manualReassign — not implemented');
  }

  applyException(
    _orderId: string,
    _request: OrderExceptionRequest
  ): Observable<OrderExceptionResponse> {
    throw new Error('Order72hApiService.applyException — not implemented');
  }
}
