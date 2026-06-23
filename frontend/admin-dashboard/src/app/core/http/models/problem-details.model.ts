/** RFC 7807 Problem Details — matches backend error contract. */
export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  correlationId?: string;
  errors?: Record<string, string[]>;
}

export function problemDetailsMessage(body: unknown, fallback: string): string {
  if (!body || typeof body !== 'object') {
    return fallback;
  }

  const pd = body as ProblemDetails;
  if (pd.detail?.trim()) {
    return pd.detail;
  }
  if (pd.title?.trim()) {
    return pd.title;
  }
  return fallback;
}
