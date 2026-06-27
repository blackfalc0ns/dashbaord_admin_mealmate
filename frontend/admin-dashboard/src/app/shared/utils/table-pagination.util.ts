import { computed, signal, type Signal } from '@angular/core';

export function createTablePagination(defaultPageSize = 5) {
  const currentPage = signal(1);
  const pageSize = signal(defaultPageSize);

  function paginated<T>(source: Signal<T[]>): Signal<T[]> {
    return computed(() => {
      const list = source();
      const start = (currentPage() - 1) * pageSize();
      return list.slice(start, start + pageSize());
    });
  }

  function totalPages(source: Signal<unknown[]>): Signal<number> {
    return computed(() => Math.ceil(source().length / pageSize()) || 1);
  }

  function onPageChange(page: number, pages: number): void {
    if (page >= 1 && page <= pages) {
      currentPage.set(page);
    }
  }

  function resetPage(): void {
    currentPage.set(1);
  }

  return { currentPage, pageSize, paginated, totalPages, onPageChange, resetPage };
}
