import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { correlationIdInterceptor } from './interceptors/correlation-id.interceptor';
import { idempotencyInterceptor } from './interceptors/idempotency.interceptor';
import { problemDetailsInterceptor } from './interceptors/problem-details.interceptor';

export function provideAdminHttp() {
  return provideHttpClient(
    withInterceptors([
      correlationIdInterceptor,
      authInterceptor,
      idempotencyInterceptor,
      problemDetailsInterceptor,
    ]),
  );
}
