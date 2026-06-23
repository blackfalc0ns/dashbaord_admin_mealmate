export interface ApiResult<T> {
  data: T | null;
  errorMessage?: string;
  correlationId?: string;
}

export function apiSuccess<T>(data: T, correlationId?: string): ApiResult<T> {
  return { data, correlationId };
}

export function apiError<T>(message: string, correlationId?: string): ApiResult<T> {
  return { data: null, errorMessage: message, correlationId };
}
