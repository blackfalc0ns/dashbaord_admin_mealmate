import { Component, computed, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch, lucideRadar } from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { DELIVERY_STATUS_LABELS, OPERATIONS_I18N } from '@/core/i18n/translations/operations.i18n';
import { MmTablePaginationComponent } from '@/shared/components/layout/table-pagination';
import { createTablePagination } from '@/shared/utils/table-pagination.util';
import { OperationsStore } from '../../../data/operations-store';
import { DeliveryStatus } from '../../../models/delivery.model';

@Component({
  selector: 'mm-tracking-panel',
  standalone: true,
  imports: [NgClass, NgIcon, MmTablePaginationComponent],
  providers: [provideIcons({ lucideSearch, lucideRadar })],
  templateUrl: './tracking-panel.component.html',
})
export class TrackingPanelComponent {
  readonly locale = inject(AppLocaleService);
  readonly state = inject(OperationsStore);
  readonly copy = computed(() => OPERATIONS_I18N[this.locale.locale()]);
  readonly searchQuery = signal('');
  readonly statusFilter = signal('all');
  readonly pg = createTablePagination(5);
  readonly currentPage = this.pg.currentPage;
  readonly pageSize = this.pg.pageSize;

  readonly filteredRows = computed(() => {
    let rows = this.state.trackingRows();
    const q = this.searchQuery().toLowerCase().trim();
    const status = this.statusFilter();
    if (q) {
      rows = rows.filter(
        (r) =>
          r.orderId.toLowerCase().includes(q) ||
          r.customerDisplayName.toLowerCase().includes(q) ||
          r.driverName.toLowerCase().includes(q),
      );
    }
    if (status !== 'all') rows = rows.filter((r) => r.status === status);
    return rows;
  });

  readonly paginatedRows = this.pg.paginated(this.filteredRows);
  readonly totalPages = this.pg.totalPages(this.filteredRows);
  readonly paginationItems = computed(() => (this.locale.isRtl() ? 'توصيل' : 'deliveries'));

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
    this.pg.resetPage();
  }

  onPageChange(page: number): void {
    this.pg.onPageChange(page, this.totalPages());
  }

  statusLabel(status: DeliveryStatus): string {
    return DELIVERY_STATUS_LABELS[this.locale.locale()][status] ?? status;
  }

  statusClass(status: DeliveryStatus): string {
    switch (status) {
      case 'in_transit':
      case 'picked_up':
        return 'bg-sky-50 text-sky-700 ring-sky-200';
      case 'arriving':
        return 'bg-violet-50 text-violet-700 ring-violet-200';
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
      default:
        return 'bg-amber-50 text-amber-700 ring-amber-200';
    }
  }
}
