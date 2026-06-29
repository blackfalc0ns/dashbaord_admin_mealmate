import { Component, computed, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideClock,
  lucideExternalLink,
  lucideSearch,
  lucideShieldCheck,
  lucideSnowflake,
  lucideUserX,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { LIFECYCLE_I18N } from '@/core/i18n/translations/lifecycle.i18n';
import { MmOperationsKpiCardComponent } from '@/shared/components/operations';
import { MmTablePaginationComponent } from '@/shared/components/layout/table-pagination';
import { createTablePagination } from '@/shared/utils/table-pagination.util';
import { SubscriptionsStore } from '../../data/subscriptions-store';
import {
  IndividualSubscriptionRow,
  IndividualSubscriptionStatus,
} from '../../models/lifecycle.model';

type IndividualFilter = 'all' | IndividualSubscriptionStatus;

@Component({
  selector: 'mm-individual-subscriptions-workspace-page',
  standalone: true,
  imports: [
    NgClass,
    NgIcon,
    RouterLink,
    MmOperationsKpiCardComponent,
    MmTablePaginationComponent,
  ],
  providers: [
    provideIcons({
      lucideClock,
      lucideExternalLink,
      lucideSearch,
      lucideShieldCheck,
      lucideSnowflake,
      lucideUserX,
    }),
  ],
  templateUrl: './individual-subscriptions-workspace-page.component.html',
  host: { class: 'block' },
})
export class IndividualSubscriptionsWorkspacePageComponent {
  readonly locale = inject(AppLocaleService);
  readonly store = inject(SubscriptionsStore);

  readonly copy = computed(() => LIFECYCLE_I18N[this.locale.locale()]);
  readonly searchQuery = signal('');
  readonly statusFilter = signal<IndividualFilter>('all');
  readonly pg = createTablePagination(10);
  readonly currentPage = this.pg.currentPage;
  readonly pageSize = this.pg.pageSize;

  readonly lifecycleStats = computed(() => this.store.lifecycleStats());

  readonly kpis = computed(() => ({
    active: this.lifecycleStats().individualActive,
    frozen: this.lifecycleStats().individualFrozen,
    expiring: this.lifecycleStats().individualExpiring,
    cancelled: this.lifecycleStats().individualCancelled,
  }));

  readonly filteredRows = computed(() => {
    let rows = this.store.individualSubscriptions();
    const q = this.searchQuery().toLowerCase().trim();
    const st = this.statusFilter();

    if (st !== 'all') {
      rows = rows.filter((r) => r.status === st);
    }
    if (q) {
      rows = rows.filter(
        (r) =>
          r.customerNameAr.toLowerCase().includes(q) ||
          r.customerNameEn.toLowerCase().includes(q) ||
          r.subscriptionId.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          r.areaAr.toLowerCase().includes(q) ||
          r.areaEn.toLowerCase().includes(q),
      );
    }
    return rows;
  });

  readonly paginatedRows = computed(() => {
    const rows = this.filteredRows();
    const start = (this.currentPage() - 1) * this.pageSize();
    return rows.slice(start, start + this.pageSize());
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredRows().length / this.pageSize())),
  );

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    this.pg.resetPage();
  }

  setFilter(filter: IndividualFilter): void {
    this.statusFilter.set(filter);
    this.pg.resetPage();
  }

  customerName(row: IndividualSubscriptionRow): string {
    return this.locale.isRtl() ? row.customerNameAr : row.customerNameEn;
  }

  programBundle(row: IndividualSubscriptionRow): string {
    const program = this.locale.isRtl() ? row.programAr : row.programEn;
    const bundle = this.locale.isRtl() ? row.bundleAr : row.bundleEn;
    return `${program} · ${bundle}`;
  }

  tierLabel(row: IndividualSubscriptionRow): string {
    return this.locale.isRtl() ? row.tierAr : row.tierEn;
  }

  areaLabel(row: IndividualSubscriptionRow): string {
    return this.locale.isRtl() ? row.areaAr : row.areaEn;
  }

  statusLabel(row: IndividualSubscriptionRow): string {
    return this.locale.isRtl() ? row.statusAr : row.statusEn;
  }

  startDate(row: IndividualSubscriptionRow): string {
    return this.locale.isRtl() ? row.startDateAr : row.startDateEn;
  }

  statusClass(status: IndividualSubscriptionStatus): string {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
      case 'Frozen':
        return 'bg-sky-50 text-sky-700 ring-sky-200';
      case 'Expiring':
        return 'bg-amber-50 text-amber-700 ring-amber-200';
      case 'Cancelled':
        return 'bg-slate-100 text-slate-600 ring-slate-200';
      default:
        return 'bg-slate-100 text-slate-600 ring-slate-200';
    }
  }

  onPageChange(page: number): void {
    this.pg.onPageChange(page, this.totalPages());
  }
}
