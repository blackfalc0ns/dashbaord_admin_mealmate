export interface PagedRequest {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface PagedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export function emptyPage<T>(page = 1, pageSize = 20): PagedResponse<T> {
  return { items: [], page, pageSize, totalCount: 0, totalPages: 0 };
}
