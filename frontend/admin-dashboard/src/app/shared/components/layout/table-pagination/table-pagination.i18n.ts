export type TablePaginationLocale = 'ar' | 'en';

export interface TablePaginationCopy {
  showingItems: string;
  of: string;
  page: string;
  show: string;
}

export const TABLE_PAGINATION_I18N: Record<TablePaginationLocale, TablePaginationCopy> = {
  ar: {
    showingItems: 'عرض',
    of: 'من',
    page: 'صفحة',
    show: 'عرض:',
  },
  en: {
    showingItems: 'Showing',
    of: 'of',
    page: 'Page',
    show: 'Show:',
  },
};
