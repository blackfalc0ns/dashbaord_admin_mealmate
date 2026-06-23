import { Injectable } from '@angular/core';

/** Generates and tracks correlation IDs for API tracing. */
@Injectable({ providedIn: 'root' })
export class CorrelationIdService {
  create(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
    return `corr-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }
}
