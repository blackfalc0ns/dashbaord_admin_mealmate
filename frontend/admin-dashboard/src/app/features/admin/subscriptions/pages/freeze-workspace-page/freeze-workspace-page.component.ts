import { Component, computed, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCalendarClock,
  lucideCircleAlert,
  lucideClock,
  lucideChevronDown,
  lucideChevronRight,
  lucideSave,
  lucideSearch,
  lucideSettings2,
  lucideSlidersHorizontal,
  lucideSnowflake,
  lucideUser,
  lucideX,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { LIFECYCLE_I18N } from '@/core/i18n/translations/lifecycle.i18n';
import { MmDetailToastComponent } from '@/shared/components/accounts';
import { MmTablePaginationComponent } from '@/shared/components/layout/table-pagination';
import { createTablePagination } from '@/shared/utils/table-pagination.util';
import { SubscriptionsStore } from '../../data/subscriptions-store';
import { FreezeRequestRow, FreezeRequestStatus } from '../../models/freeze.model';

type FreezeFilter = 'all' | FreezeRequestStatus;
type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

@Component({
  selector: 'mm-freeze-workspace-page',
  standalone: true,
  imports: [FormsModule, NgClass, NgIcon, RouterLink, MmDetailToastComponent, MmTablePaginationComponent],
  providers: [
    provideIcons({
      lucideCalendarClock,
      lucideCircleAlert,
      lucideClock,
      lucideChevronDown,
      lucideChevronRight,
      lucideSave,
      lucideSearch,
      lucideSettings2,
      lucideSlidersHorizontal,
      lucideSnowflake,
      lucideUser,
      lucideX,
    }),
  ],
  templateUrl: './freeze-workspace-page.component.html',
  host: { class: 'block' },
})
export class FreezeWorkspacePageComponent {
  readonly locale = inject(AppLocaleService);
  readonly store = inject(SubscriptionsStore);

  readonly copy = computed(() => LIFECYCLE_I18N[this.locale.locale()]);
  readonly searchQuery = signal('');
  readonly statusFilter = signal<FreezeFilter>('all');
  readonly detailOpen = signal(false);
  readonly policyExpanded = signal(false);
  readonly selectedRequest = signal<FreezeRequestRow | null>(null);
  readonly toast = signal<string | null>(null);
  readonly policyDraft = signal(this.store.freezePolicy().defaultDurationDays);
  readonly pg = createTablePagination(5);
  readonly currentPage = this.pg.currentPage;
  readonly pageSize = this.pg.pageSize;

  readonly freezePolicy = computed(() => this.store.freezePolicy());
  readonly freezeStats = computed(() => this.store.freezeStats());

  readonly kpis = computed(() => ({
    frozen: this.freezeStats().currentlyFrozen,
    pending: this.freezeStats().pendingStart,
    ending: this.freezeStats().endingSoon,
    month: this.freezeStats().requestsThisMonth,
  }));

  readonly filteredRequests = computed(() => {
    let rows = this.store.freezeRequests();
    const q = this.searchQuery().toLowerCase().trim();
    const st = this.statusFilter();
    if (st !== 'all') rows = rows.filter((r) => r.status === st);
    if (q) {
      rows = rows.filter(
        (r) =>
          r.customerNameAr.toLowerCase().includes(q) ||
          r.customerNameEn.toLowerCase().includes(q) ||
          r.subscriptionId.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q),
      );
    }
    return rows;
  });

  readonly paginatedRequests = this.pg.paginated(this.filteredRequests);
  readonly totalPages = this.pg.totalPages(this.filteredRequests);

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
    this.pg.resetPage();
  }

  setFilter(filter: FreezeFilter): void {
    this.statusFilter.set(filter);
    this.pg.resetPage();
  }

  togglePolicy(): void {
    this.policyExpanded.update((v) => !v);
  }

  onPolicyDurationChange(value: string): void {
    this.policyDraft.set(Math.max(1, Math.min(30, Number(value) || 1)));
  }

  savePolicy(): void {
    this.store.updateFreezePolicy(this.policyDraft());
    this.showToast(this.copy().policySaved);
  }

  openDetail(row: FreezeRequestRow): void {
    this.selectedRequest.set(row);
    this.detailOpen.set(true);
  }

  closeDetail(): void {
    this.detailOpen.set(false);
    this.selectedRequest.set(null);
  }

  confirmEndEarly(): void {
    const row = this.selectedRequest();
    if (!row || !row.canEndEarly) return;
    if (!confirm(this.copy().endFreezeConfirm)) return;
    const ok = this.store.endFreezeEarly(row.id);
    if (ok) {
      this.selectedRequest.set(this.store.freezeRequests().find((r) => r.id === row.id) ?? null);
      this.showToast(this.copy().endFreezeEarly);
    }
  }

  customerName(row: FreezeRequestRow): string {
    return this.locale.isRtl() ? row.customerNameAr : row.customerNameEn;
  }

  programBundle(row: FreezeRequestRow): string {
    return `${this.locale.isRtl() ? row.programAr : row.programEn} · ${this.locale.isRtl() ? row.bundleAr : row.bundleEn}`;
  }

  tierLabel(row: FreezeRequestRow): string {
    return this.locale.isRtl() ? row.tierAr : row.tierEn;
  }

  subTypeLabel(row: FreezeRequestRow): string {
    return this.locale.isRtl() ? row.subscriptionTypeAr : row.subscriptionTypeEn;
  }

  statusLabel(row: FreezeRequestRow): string {
    return this.locale.isRtl() ? row.statusAr : row.statusEn;
  }

  requestedAt(row: FreezeRequestRow): string {
    return this.locale.isRtl() ? row.requestedAtAr : row.requestedAtEn;
  }

  freezeStart(row: FreezeRequestRow): string {
    return this.locale.isRtl() ? row.freezeStartDateAr : row.freezeStartDateEn;
  }

  freezeEnd(row: FreezeRequestRow): string {
    return this.locale.isRtl() ? row.freezeEndDateAr : row.freezeEndDateEn;
  }

  policyUpdatedBy(): string {
    const p = this.freezePolicy();
    return this.locale.isRtl() ? p.updatedByAr : p.updatedByEn;
  }

  conflictNote(row: FreezeRequestRow): string | null {
    if (!row.has72hConflict) return null;
    return this.locale.isRtl() ? row.conflictNoteAr ?? null : row.conflictNoteEn ?? null;
  }

  statusTone(status: FreezeRequestStatus): StatusTone {
    switch (status) {
      case 'Active':
        return 'info';
      case 'PendingStart':
        return 'warning';
      case 'EndingSoon':
        return 'warning';
      case 'Completed':
        return 'success';
      default:
        return 'neutral';
    }
  }

  statusBadgeClass(tone: StatusTone): string {
    switch (tone) {
      case 'success':
        return 'bg-emerald-50 text-emerald-700 ring-emerald-600/15';
      case 'warning':
        return 'bg-amber-50 text-amber-700 ring-amber-600/15';
      case 'info':
        return 'bg-sky-50 text-sky-700 ring-sky-600/15';
      default:
        return 'bg-slate-50 text-slate-700 ring-slate-600/15';
    }
  }

  statusDotClass(tone: StatusTone): string {
    switch (tone) {
      case 'success':
        return 'bg-emerald-500';
      case 'warning':
        return 'bg-amber-500';
      case 'info':
        return 'bg-sky-500';
      default:
        return 'bg-slate-400';
    }
  }

  onPageChange(page: number): void {
    this.pg.onPageChange(page, this.totalPages());
  }

  private showToast(message: string): void {
    this.toast.set(message);
    setTimeout(() => this.toast.set(null), 2800);
  }
}
