import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CorrelationIdService } from '../correlation-id.service';

export const correlationIdInterceptor: HttpInterceptorFn = (req, next) => {
  const correlationId = inject(CorrelationIdService).create();
  return next(
    req.clone({
      setHeaders: { 'X-Correlation-Id': correlationId },
    }),
  );
};
