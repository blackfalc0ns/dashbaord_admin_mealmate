import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CorrelationIdService } from '../correlation-id.service';

const MUTATING = new Set(['POST', 'PUT', 'PATCH']);

export const idempotencyInterceptor: HttpInterceptorFn = (req, next) => {
  if (!MUTATING.has(req.method) || req.headers.has('Idempotency-Key')) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: { 'Idempotency-Key': inject(CorrelationIdService).create() },
    }),
  );
};
