import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBell,
  lucideCircleAlert,
  lucideClock,
  lucideEye,
  lucideRefreshCw,
  lucideSave,
  lucideSearch,
  lucideSettings2,
  lucideTrendingUp,
  lucideX,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { LIFECYCLE_I18N } from '@/core/i18n/translations/lifecycle.i18n';
import { MmOperationsKpiCardComponent } from '@/shared/components/operations';
import { MmTablePaginationComponent } from '@/shared/components/layout/table-pagination';
import { createTablePagination } from '@/shared/utils/table-pagination.util';
import { SubscriptionsStore } from '../../data/subscriptions-store';
import { RenewalRow, RenewalStatus } from '../../models/renewal.model';

type RenewalFilter = 'all' | RenewalStatus;

@Component({
  selector: 'mm-renewals-workspace-page',
  standalone: true,
  imports: [
    DecimalPipe,
    FormsModule,
    NgClass,
    NgIcon,
    RouterLink,
    MmOperationsKpiCardComponent,
    MmTablePaginationComponent,
  ],
  providers: [
    provideIcons({
      lucideBell,
      lucideCircleAlert,
      lucideClock,
      lucideEye,
      lucideRefreshCw,
      lucideSave,
      lucideSearch,
      lucideSettings2,
      lucideTrendingUp,
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
  readonly selectedRenewal = signal<RenewalRow | null>(null);
  readonly toast = signal<string | null>(null);
  readonly policyFirst = signal(this.store.renewalPolicy().firstReminderDays);
  readonly policySecond = signal(this.store.renewalPolicy().secondReminderDays);
  readonly policyFinal = signal(this.store.renewalPolicy().finalReminderDays);
  readonly pg = createTablePagination(8);
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

    if (st !== 'all') {
      rows = rows.filter((r) => r.status === st);
    }
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

  readonly paginatedRenewals = computed(() => {
    const rows = this.filteredRenewals();
    const start = (this.currentPage() - 1) * this.pageSize();
    return rows.slice(start, start + this.pageSize());
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredRenewals().length / this.pageSize())),
  );

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
    this.pg.resetPage();
  }

  setFilter(filter: RenewalFilter): void {
    this.statusFilter.set(filter);
    this.pg.resetPage();
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
      this.selectedRenewal.set(
        this.store.renewals().find((r) => r.id === row.id) ?? null,
      );
      this.showToast(this.copy().reminderSent);
    }
  }

  customerName(row: RenewalRow): string {
    return this.locale.isRtl() ? row.customerNameAr : row.customerNameEn;
  }

  programBundle(row: RenewalRow): string {
    const program = this.locale.isRtl() ? row.programAr : row.programEn;
    const bundle = this.locale.isRtl() ? row.bundleAr : row.bundleEn;
    return `${program} · ${bundle}`;
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
    if (days < 0) return 'text-red-600';
    if (days <= 3) return 'text-orange-600';
    if (days <= 7) return 'text-amber-600';
    return 'text-slate-700';
  }

  statusClass(status: RenewalStatus): string {
    switch (status) {
      case 'ExpiringSoon':
        return 'bg-amber-50 text-amber-700 ring-amber-200';
      case 'ReminderSent':
        return 'bg-indigo-50 text-indigo-700 ring-indigo-200';
      case 'InProgress':
        return 'bg-sky-50 text-sky-700 ring-sky-200';
      case 'Renewed':
        return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
      case 'Lapsed':
        return 'bg-slate-100 text-slate-600 ring-slate-200';
      case 'AtRisk':
        return 'bg-red-50 text-red-700 ring-red-200';
      default:
        return 'bg-slate-100 text-slate-600 ring-slate-200';
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
