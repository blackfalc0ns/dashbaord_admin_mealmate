import { Component, inject, computed, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { OPERATIONS_I18N } from '@/core/i18n/translations/operations.i18n';
import { MmTablePaginationComponent } from '@/shared/components/layout/table-pagination';
import { createTablePagination } from '@/shared/utils/table-pagination.util';
import { OperationsStore } from '../../data/operations-store';
import { OrderExceptionType } from '../../models';

@Component({
  selector: 'mm-operations-audit-page',
  standalone: true,
  imports: [NgIcon, MmTablePaginationComponent],
  providers: [provideIcons({ lucideSearch })],
  templateUrl: './operations-audit-page.component.html',
  host: { class: 'block' },
})
export class OperationsAuditPageComponent {
  readonly locale = inject(AppLocaleService);
  readonly state = inject(OperationsStore);
  readonly copy = computed(() => OPERATIONS_I18N[this.locale.locale()]);
  readonly searchQuery = signal('');
  readonly pg = createTablePagination(5);
  readonly currentPage = this.pg.currentPage;
  readonly pageSize = this.pg.pageSize;

  readonly logs = computed(() => {
    let list = this.state.exceptionLogs();
    const q = this.searchQuery().toLowerCase().trim();
    if (q) {
      list = list.filter(
        (l) =>
          l.orderId.toLowerCase().includes(q) ||
          l.customerDisplayName.toLowerCase().includes(q) ||
          l.reason.toLowerCase().includes(q),
      );
    }
    return list;
  });

  readonly paginatedLogs = this.pg.paginated(this.logs);
  readonly totalPages = this.pg.totalPages(this.logs);
  readonly paginationItems = computed(() => (this.locale.isRtl() ? 'استثناء' : 'exceptions'));

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
    this.pg.resetPage();
  }

  onPageChange(page: number): void {
    this.pg.onPageChange(page, this.totalPages());
  }

  exceptionLabel(type: OrderExceptionType): string {
    switch (type) {
      case OrderExceptionType.ChangeBox:
        return this.copy().changeBox;
      case OrderExceptionType.ChangeRestaurant:
        return this.copy().changeRestaurant;
      case OrderExceptionType.CancelDay:
        return this.copy().cancelDay;
      default:
        return type;
    }
  }
}
