import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowUpRight,
  lucideAward,
  lucideCheck,
  lucideChevronDown,
  lucideChevronRight,
  lucideCircleAlert,
  lucideClock,
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
import { UpgradeRequestRow, UpgradeStatus, UpgradeTier } from '../../models/upgrade.model';

type UpgradeFilter = 'all' | UpgradeStatus;
type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

@Component({
  selector: 'mm-upgrades-workspace-page',
  standalone: true,
  imports: [DecimalPipe, FormsModule, NgClass, NgIcon, RouterLink, MmDetailToastComponent, MmTablePaginationComponent],
  providers: [
    provideIcons({
      lucideArrowUpRight,
      lucideAward,
      lucideCheck,
      lucideChevronDown,
      lucideChevronRight,
      lucideCircleAlert,
      lucideClock,
      lucideSave,
      lucideSearch,
      lucideSettings2,
      lucideSlidersHorizontal,
      lucideTrendingUp,
      lucideUser,
      lucideX,
    }),
  ],
  templateUrl: './upgrades-workspace-page.component.html',
  host: { class: 'block' },
})
export class UpgradesWorkspacePageComponent {
  readonly locale = inject(AppLocaleService);
  readonly store = inject(SubscriptionsStore);

  readonly copy = computed(() => LIFECYCLE_I18N[this.locale.locale()]);
  readonly searchQuery = signal('');
  readonly statusFilter = signal<UpgradeFilter>('all');
  readonly detailOpen = signal(false);
  readonly policyExpanded = signal(false);
  readonly selectedRequest = signal<UpgradeRequestRow | null>(null);
  readonly toast = signal<string | null>(null);
  readonly policyProrate = signal(this.store.upgradePolicy().prorateRemainingDays);
  readonly policyEliteReview = signal(this.store.upgradePolicy().requireReviewForElite);
  readonly policySnapshot = signal(this.store.upgradePolicy().savePricingSnapshot);
  readonly pg = createTablePagination(5);
  readonly currentPage = this.pg.currentPage;
  readonly pageSize = this.pg.pageSize;

  readonly upgradePolicy = computed(() => this.store.upgradePolicy());
  readonly upgradeStats = computed(() => this.store.upgradeStats());

  readonly kpis = computed(() => ({
    pending: this.upgradeStats().pendingRequests,
    inProgress: this.upgradeStats().inProgress,
    needsReview: this.upgradeStats().needsReview,
    completed: this.upgradeStats().completedThisMonth,
    revenue: this.upgradeStats().upgradeRevenueKd,
  }));

  readonly filteredRequests = computed(() => {
    let rows = this.store.upgradeRequests();
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

  setFilter(filter: UpgradeFilter): void {
    this.statusFilter.set(filter);
    this.pg.resetPage();
  }

  togglePolicy(): void {
    this.policyExpanded.update((v) => !v);
  }

  savePolicy(): void {
    this.store.updateUpgradePolicy({
      prorateRemainingDays: this.policyProrate(),
      requireReviewForElite: this.policyEliteReview(),
      savePricingSnapshot: this.policySnapshot(),
    });
    this.showToast(this.copy().upgradePolicySaved);
  }

  openDetail(row: UpgradeRequestRow): void {
    this.selectedRequest.set(row);
    this.detailOpen.set(true);
  }

  closeDetail(): void {
    this.detailOpen.set(false);
    this.selectedRequest.set(null);
  }

  approveUpgrade(): void {
    const row = this.selectedRequest();
    if (!row || !row.canApprove) return;
    const ok = this.store.approveUpgrade(row.id);
    if (ok) {
      this.selectedRequest.set(this.store.upgradeRequests().find((r) => r.id === row.id) ?? null);
      this.showToast(this.copy().upgradeApproved);
    }
  }

  rejectUpgrade(): void {
    const row = this.selectedRequest();
    if (!row || !row.canReject) return;
    if (!confirm(this.copy().rejectConfirm)) return;
    const ok = this.store.rejectUpgrade(
      row.id,
      'مرفوض من الأدمن — لا يلبي شروط الترقية',
      'Rejected by admin — does not meet upgrade criteria',
    );
    if (ok) {
      this.selectedRequest.set(this.store.upgradeRequests().find((r) => r.id === row.id) ?? null);
      this.showToast(this.copy().upgradeRejected);
    }
  }

  customerName(row: UpgradeRequestRow): string {
    return this.locale.isRtl() ? row.customerNameAr : row.customerNameEn;
  }

  programBundle(row: UpgradeRequestRow): string {
    return `${this.locale.isRtl() ? row.programAr : row.programEn} · ${this.locale.isRtl() ? row.bundleAr : row.bundleEn}`;
  }

  tierLabel(tierAr: string, tierEn: string): string {
    return this.locale.isRtl() ? tierAr : tierEn;
  }

  tierChange(row: UpgradeRequestRow): string {
    const from = this.tierLabel(row.currentTierAr, row.currentTierEn);
    const to = this.tierLabel(row.targetTierAr, row.targetTierEn);
    return `${from} → ${to}`;
  }

  statusLabel(row: UpgradeRequestRow): string {
    return this.locale.isRtl() ? row.statusAr : row.statusEn;
  }

  sourceLabel(row: UpgradeRequestRow): string {
    return this.locale.isRtl() ? row.sourceAr : row.sourceEn;
  }

  accessGain(row: UpgradeRequestRow): string {
    return this.locale.isRtl() ? row.restaurantAccessGainAr : row.restaurantAccessGainEn;
  }

  requestedAt(row: UpgradeRequestRow): string {
    return this.locale.isRtl() ? row.requestedAtAr : row.requestedAtEn;
  }

  rejectReason(row: UpgradeRequestRow): string | null {
    if (!row.rejectReasonAr) return null;
    return this.locale.isRtl() ? row.rejectReasonAr : row.rejectReasonEn;
  }

  policyUpdatedBy(): string {
    const p = this.upgradePolicy();
    return this.locale.isRtl() ? p.updatedByAr : p.updatedByEn;
  }

  tierClass(tier: UpgradeTier): string {
    switch (tier) {
      case 'basic':
        return 'bg-slate-50 text-slate-700 ring-slate-600/15';
      case 'platinum':
        return 'bg-indigo-50 text-indigo-700 ring-indigo-600/15';
      case 'elite':
        return 'bg-amber-50 text-amber-800 ring-amber-600/15';
      default:
        return 'bg-slate-50 text-slate-600 ring-slate-600/15';
    }
  }

  statusTone(status: UpgradeStatus): StatusTone {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'InProgress':
        return 'info';
      case 'NeedsReview':
        return 'warning';
      case 'Completed':
        return 'success';
      case 'Rejected':
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
