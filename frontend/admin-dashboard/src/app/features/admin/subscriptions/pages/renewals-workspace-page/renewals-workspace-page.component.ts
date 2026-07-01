import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBell,
  lucideChevronDown,
  lucideChevronRight,
  lucideCircleAlert,
  lucideClock,
  lucideRefreshCw,
  lucideSave,
  lucideSearch,
  lucideSettings2,
  lucideSlidersHorizontal,
  lucideTrendingUp,
  lucideUser,
  lucideX,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { LIFECYCLE_I18N } from '@/core/i18n/translations/lifecycle.i18n';
import { MmDetailToastComponent } from '@/shared/components/accounts';
import { MmTablePaginationComponent } from '@/shared/components/layout/table-pagination';
import { createTablePagination } from '@/shared/utils/table-pagination.util';
import { SubscriptionsStore } from '../../data/subscriptions-store';
import { RenewalRow, RenewalStatus } from '../../models/renewal.model';

type RenewalFilter = 'all' | RenewalStatus;
type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

@Component({
  selector: 'mm-renewals-workspace-page',
  standalone: true,
  imports: [DecimalPipe, FormsModule, NgClass, NgIcon, RouterLink, MmDetailToastComponent, MmTablePaginationComponent],
  providers: [
    provideIcons({
      lucideBell,
      lucideChevronDown,
      lucideChevronRight,
      lucideCircleAlert,
      lucideClock,
      lucideRefreshCw,
      lucideSave,
      lucideSearch,
      lucideSettings2,
      lucideSlidersHorizontal,
      lucideTrendingUp,
      lucideUser,
      lucideX,
    }),
  ],
  templateUrl: './renewals-workspace-page.component.html',
  host: { class: 'block' },
})
export class RenewalsWorkspacePageComponent {
  readonly locale = inject(AppLocaleService);
  readonly store = inject(SubscriptionsStore);

  readonly copy = computed(() => LIFECYCLE_I18N[this.locale.locale()]);
  readonly searchQuery = signal('');
  readonly statusFilter = signal<RenewalFilter>('all');
  readonly detailOpen = signal(false);
  readonly policyExpanded = signal(false);
  readonly selectedRenewal = signal<RenewalRow | null>(null);
  readonly toast = signal<string | null>(null);
  readonly policyFirst = signal(this.store.renewalPolicy().firstReminderDays);
  readonly policySecond = signal(this.store.renewalPolicy().secondReminderDays);
  readonly policyFinal = signal(this.store.renewalPolicy().finalReminderDays);
  readonly pg = createTablePagination(5);
  readonly currentPage = this.pg.currentPage;
  readonly pageSize = this.pg.pageSize;

  readonly renewalPolicy = computed(() => this.store.renewalPolicy());
  readonly renewalStats = computed(() => this.store.renewalStats());

  readonly kpis = computed(() => ({
    expiring: this.renewalStats().expiringThisWeek,
    reminders: this.renewalStats().remindersSent,
    inProgress: this.renewalStats().inProgress,
    renewed: this.renewalStats().renewedThisMonth,
    atRisk: this.renewalStats().atRisk,
  }));

  readonly filteredRenewals = computed(() => {
    let rows = this.store.renewals();
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

  readonly paginatedRenewals = this.pg.paginated(this.filteredRenewals);
  readonly totalPages = this.pg.totalPages(this.filteredRenewals);

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
    this.pg.resetPage();
  }

  setFilter(filter: RenewalFilter): void {
    this.statusFilter.set(filter);
    this.pg.resetPage();
  }

  togglePolicy(): void {
    this.policyExpanded.update((v) => !v);
  }

  savePolicy(): void {
    this.store.updateRenewalPolicy({
      firstReminderDays: Math.max(1, this.policyFirst()),
      secondReminderDays: Math.max(1, this.policySecond()),
      finalReminderDays: Math.max(1, this.policyFinal()),
    });
    this.showToast(this.copy().renewalPolicySaved);
  }

  openDetail(row: RenewalRow): void {
    this.selectedRenewal.set(row);
    this.detailOpen.set(true);
  }

  closeDetail(): void {
    this.detailOpen.set(false);
    this.selectedRenewal.set(null);
  }

  sendReminder(): void {
    const row = this.selectedRenewal();
    if (!row || !row.canSendReminder) return;
    const ok = this.store.sendRenewalReminder(row.id);
    if (ok) {
      this.selectedRenewal.set(this.store.renewals().find((r) => r.id === row.id) ?? null);
      this.showToast(this.copy().reminderSent);
    }
  }

  customerName(row: RenewalRow): string {
    return this.locale.isRtl() ? row.customerNameAr : row.customerNameEn;
  }

  programBundle(row: RenewalRow): string {
    return `${this.locale.isRtl() ? row.programAr : row.programEn} · ${this.locale.isRtl() ? row.bundleAr : row.bundleEn}`;
  }

  tierLabel(row: RenewalRow): string {
    return this.locale.isRtl() ? row.tierAr : row.tierEn;
  }

  subTypeLabel(row: RenewalRow): string {
    return this.locale.isRtl() ? row.subscriptionTypeAr : row.subscriptionTypeEn;
  }

  statusLabel(row: RenewalRow): string {
    return this.locale.isRtl() ? row.statusAr : row.statusEn;
  }

  endDate(row: RenewalRow): string {
    return this.locale.isRtl() ? row.endDateAr : row.endDateEn;
  }

  reminderStage(row: RenewalRow): string {
    return this.locale.isRtl() ? row.reminderStageAr : row.reminderStageEn;
  }

  lastReminder(row: RenewalRow): string {
    if (!row.lastReminderAtAr) return '—';
    return this.locale.isRtl() ? row.lastReminderAtAr : row.lastReminderAtEn ?? '—';
  }

  promoCode(row: RenewalRow): string | null {
    return this.locale.isRtl() ? row.promoCodeAr : row.promoCodeEn;
  }

  renewedAt(row: RenewalRow): string | null {
    if (!row.renewedAtAr) return null;
    return this.locale.isRtl() ? row.renewedAtAr : row.renewedAtEn;
  }

  policyUpdatedBy(): string {
    const p = this.renewalPolicy();
    return this.locale.isRtl() ? p.updatedByAr : p.updatedByEn;
  }

  daysRemainingClass(days: number): string {
    if (days < 0) return 'text-rose-600';
    if (days <= 3) return 'text-orange-600';
    if (days <= 7) return 'text-amber-600';
    return 'text-slate-700';
  }

  statusTone(status: RenewalStatus): StatusTone {
    switch (status) {
      case 'ExpiringSoon':
        return 'warning';
      case 'ReminderSent':
        return 'info';
      case 'InProgress':
        return 'info';
      case 'Renewed':
        return 'success';
      case 'AtRisk':
        return 'danger';
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
      case 'danger':
        return 'bg-rose-50 text-rose-700 ring-rose-600/15';
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
      case 'danger':
        return 'bg-rose-500';
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
