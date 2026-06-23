import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { problemDetailsMessage } from '../models/problem-details.model';

export const problemDetailsInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((err: unknown) => {
      if (!(err instanceof HttpErrorResponse)) {
        return throwError(() => err);
      }

      const message = problemDetailsMessage(
        err.error,
        err.statusText || 'حدث خطأ أثناء الاتصال بالخادم',
      );
      return throwError(() => new Error(message));
    }),
  );
