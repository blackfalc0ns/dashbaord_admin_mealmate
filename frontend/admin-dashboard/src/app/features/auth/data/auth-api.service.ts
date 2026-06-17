import { Injectable } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';
import { AdminLoginRequest, AdminLoginResponse } from '../models/login.model';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  login(request: AdminLoginRequest): Observable<AdminLoginResponse> {
    if (!request.identifier.trim() || !request.password.trim()) {
      return throwError(() => new Error('بيانات الاعتماد غير مكتملة'));
    }

    return of({
      accessToken: 'stub-token',
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      role: 'super_admin' as const,
    }).pipe(delay(1200));
  }
}
