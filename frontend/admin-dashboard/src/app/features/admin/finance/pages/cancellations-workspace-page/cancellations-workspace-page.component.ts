import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBanknote,
  lucideChevronDown,
  lucideChevronRight,
  lucideCircleAlert,
  lucideCheck,
  lucidePercent,
  lucideSave,
  lucideSearch,
  lucideSettings2,
  lucideShieldAlert,
  lucideSlidersHorizontal,
  lucideUndo2,
  lucideUser,
  lucideX,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { FINANCE_I18N } from '@/core/i18n/translations/finance.i18n';
import { MmDetailToastComponent } from '@/shared/components/accounts';
import { MmTablePaginationComponent } from '@/shared/components/layout/table-pagination';
import { createTablePagination } from '@/shared/utils/table-pagination.util';
import { applyManualCancellationFee } from '../../data/cancellation-formulas';
import { FinanceStateService } from '../../data/finance-state.service';
import { CancellationRequestRow, CancellationStatus } from '../../models/cancellation.model';

type CancellationFilter = 'all' | CancellationStatus;
type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

@Component({
  selector: 'mm-cancellations-workspace-page',
  standalone: true,
  imports: [
    DecimalPipe,
    FormsModule,
    NgClass,
    NgIcon,
    RouterLink,
    MmDetailToastComponent,
    MmTablePaginationComponent,
  ],
  providers: [
    provideIcons({
      lucideBanknote,
      lucideChevronDown,
      lucideChevronRight,
      lucideCircleAlert,
      lucideCheck,
      lucidePercent,
      lucideSave,
      lucideSearch,
      lucideSettings2,
      lucideShieldAlert,
      lucideSlidersHorizontal,
      lucideUndo2,
      lucideUser,
      lucideX,
    }),
  ],
  templateUrl: './cancellations-workspace-page.component.html',
  host: { class: 'block' },
})
export class CancellationsWorkspacePageComponent {
  readonly locale = inject(AppLocaleService);
  readonly store = inject(FinanceStateService);

  readonly copy = computed(() => FINANCE_I18N[this.locale.locale()]);
  readonly searchQuery = signal('');
  readonly statusFilter = signal<CancellationFilter>('all');
  readonly policyExpanded = signal(false);
  readonly detailOpen = signal(false);
  readonly selectedRequest = signal<CancellationRequestRow | null>(null);
  readonly toast = signal<string | null>(null);
  readonly feeDraft = signal(0);
  readonly policyFeeDraft = signal(this.store.cancellationPolicy().defaultCancellationFeePct);
  readonly policyOpsDraft = signal(this.store.cancellationPolicy().operationalDeductionDays);
  readonly pg = createTablePagination(5);
  readonly currentPage = this.pg.currentPage;
  readonly pageSize = this.pg.pageSize;

  readonly cancellationPolicy = computed(() => this.store.cancellationPolicy());
  readonly stats = computed(() => this.store.cancellationStats());

  readonly kpis = computed(() => ({
    pending: this.stats().pendingReview,
    processing: this.stats().processing,
    completed: this.stats().completedThisMonth,
    refunded: this.stats().totalRefundedThisMonth,
  }));

  readonly feePreview = computed(() => {
    const req = this.selectedRequest();
    if (!req) return null;
    return applyManualCancellationFee(req.refundableBaseKd, this.feeDraft());
  });

  readonly canEditFee = computed(() => {
    const req = this.selectedRequest();
    return !!req && (req.canApprove || req.canReject) && req.remainingRefundableDays > 0;
  });

  readonly filteredRequests = computed(() => {
    let rows = this.store.cancellationRequests();
    const q = this.searchQuery().toLowerCase().trim();
    const st = this.statusFilter();

    if (st !== 'all') {
      if (st === 'Processing') {
        rows = rows.filter((r) => r.status === 'Processing' || r.status === 'Approved');
      } else {
        rows = rows.filter((r) => r.status === st);
      }
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

  readonly paginatedRequests = this.pg.paginated(this.filteredRequests);
  readonly totalPages = this.pg.totalPages(this.filteredRequests);

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
    this.pg.resetPage();
  }

  setFilter(filter: CancellationFilter): void {
    this.statusFilter.set(filter);
    this.pg.resetPage();
  }

  togglePolicy(): void {
    this.policyExpanded.update((v) => !v);
  }

  onPolicyFeeChange(value: string | number): void {
    this.policyFeeDraft.set(Math.max(0, Math.min(100, Number(value) || 0)));
  }

  onPolicyOpsChange(value: string | number): void {
    this.policyOpsDraft.set(Math.max(0, Math.min(30, Number(value) || 0)));
  }

  savePolicy(): void {
    this.store.updateCancellationPolicy(this.policyFeeDraft(), this.policyOpsDraft());
    this.showToast(this.copy().policySaved);
  }

  policyUpdatedBy(): string {
    const p = this.cancellationPolicy();
    return this.locale.isRtl() ? p.updatedByAr : p.updatedByEn;
  }

  openDetail(row: CancellationRequestRow): void {
    this.selectedRequest.set(row);
    this.feeDraft.set(
      row.cancellationFeePct ?? this.cancellationPolicy().defaultCancellationFeePct,
    );
    this.detailOpen.set(true);
  }

  closeDetail(): void {
    this.detailOpen.set(false);
    this.selectedRequest.set(null);
  }

  onFeeChange(value: string | number): void {
    this.feeDraft.set(Math.max(0, Math.min(100, Number(value) || 0)));
  }

  saveFee(): void {
    const row = this.selectedRequest();
    if (!row) return;
    const ok = this.store.setCancellationFeePct(row.id, this.feeDraft());
    if (ok) {
      this.selectedRequest.set(this.store.cancellationRequests().find((r) => r.id === row.id) ?? null);
      this.showToast(this.copy().feeSaved);
    }
  }

  confirmApprove(): void {
    const row = this.selectedRequest();
    if (!row?.canApprove) return;
    if (!row.feeConfigured) {
      this.showToast(this.copy().approveRequiresFee);
      return;
    }
    if (!confirm(this.copy().approveConfirm)) return;
    const ok = this.store.approveCancellation(row.id);
    if (ok) {
      this.selectedRequest.set(this.store.cancellationRequests().find((r) => r.id === row.id) ?? null);
      this.showToast(this.copy().approvedToast);
    }
  }

  confirmReject(): void {
    const row = this.selectedRequest();
    if (!row?.canReject) return;
    if (!confirm(this.copy().rejectConfirm)) return;
    const ok = this.store.rejectCancellation(row.id);
    if (ok) {
      this.selectedRequest.set(this.store.cancellationRequests().find((r) => r.id === row.id) ?? null);
      this.showToast(this.copy().rejectedToast);
    }
  }

  confirmComplete(): void {
    const row = this.selectedRequest();
    if (!row?.canComplete) return;
    if (!confirm(this.copy().completeConfirm)) return;
    const ok = this.store.completeRefund(row.id);
    if (ok) {
      this.selectedRequest.set(this.store.cancellationRequests().find((r) => r.id === row.id) ?? null);
      this.showToast(this.copy().completedToast);
    }
  }

  amountOrUnset(row: CancellationRequestRow, value: number): string {
    if (!row.feeConfigured) return this.copy().feeNotSet;
    return this.formatKd(value);
  }

  customerName(row: CancellationRequestRow): string {
    return this.locale.isRtl() ? row.customerNameAr : row.customerNameEn;
  }

  programBundle(row: CancellationRequestRow): string {
    return `${this.locale.isRtl() ? row.programAr : row.programEn} · ${this.locale.isRtl() ? row.bundleAr : row.bundleEn}`;
  }

  subTypeLabel(row: CancellationRequestRow): string {
    return this.locale.isRtl() ? row.subscriptionTypeAr : row.subscriptionTypeEn;
  }

  statusLabel(row: CancellationRequestRow): string {
    return this.locale.isRtl() ? row.statusAr : row.statusEn;
  }

  requestedAt(row: CancellationRequestRow): string {
    return this.locale.isRtl() ? row.requestedAtAr : row.requestedAtEn;
  }

  refundMethod(row: CancellationRequestRow): string {
    return this.locale.isRtl() ? row.refundMethodAr : row.refundMethodEn;
  }

  customerReason(row: CancellationRequestRow): string {
    return this.locale.isRtl() ? row.customerReasonAr : row.customerReasonEn;
  }

  subscriptionStart(row: CancellationRequestRow): string {
    return this.locale.isRtl() ? row.subscriptionStartDateAr : row.subscriptionStartDateEn;
  }

  disputeNote(row: CancellationRequestRow): string | null {
    if (!row.hasDispute) return null;
    return this.locale.isRtl() ? row.disputeNoteAr ?? null : row.disputeNoteEn ?? null;
  }

  formatKd(value: number): string {
    return `${value.toFixed(3)} ${this.copy().kd}`;
  }

  statusTone(status: CancellationStatus): StatusTone {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'PendingReview':
      case 'Dispute':
        return 'warning';
      case 'Rejected':
        return 'danger';
      case 'Approved':
      case 'Processing':
        return 'info';
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
