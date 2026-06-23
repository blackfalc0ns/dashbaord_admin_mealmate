import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AdminAuthStore } from '../../auth/admin-auth.store';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AdminAuthStore).accessToken();
  if (!token) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    }),
  );
};
