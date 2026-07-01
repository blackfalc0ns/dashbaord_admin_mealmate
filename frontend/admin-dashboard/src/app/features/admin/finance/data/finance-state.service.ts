import { Injectable, computed, signal } from '@angular/core';

import {
  applyManualCancellationFee,
  clampFeePct,
  computeRefundableBase,
} from './cancellation-formulas';
import {
  CancellationPolicy,
  CancellationRequestRow,
  CancellationStats,
} from '../models/cancellation.model';
import {
  CANCELLATION_POLICY_MOCK,
  CANCELLATION_REQUESTS_MOCK,
  CANCELLATION_STATS_MOCK,
} from './cancellations.mock';

@Injectable({ providedIn: 'root' })
export class FinanceStateService {
  readonly cancellationPolicy = signal<CancellationPolicy>({ ...CANCELLATION_POLICY_MOCK });
  readonly cancellationRequests = signal<CancellationRequestRow[]>([
    ...CANCELLATION_REQUESTS_MOCK,
  ]);
  readonly cancellationStats = signal<CancellationStats>({ ...CANCELLATION_STATS_MOCK });

  readonly pendingCancellations = computed(() =>
    this.cancellationRequests().filter((r) => r.status === 'PendingReview'),
  );

  updateCancellationPolicy(
    defaultCancellationFeePct: number,
    operationalDeductionDays: number,
  ): void {
    this.cancellationPolicy.update((p) => ({
      ...p,
      defaultCancellationFeePct: clampFeePct(defaultCancellationFeePct),
      operationalDeductionDays: Math.max(0, Math.min(30, operationalDeductionDays)),
      updatedAt: new Date().toISOString(),
    }));
  }

  setCancellationFeePct(id: string, feePct: number): boolean {
    const rows = this.cancellationRequests();
    const idx = rows.findIndex((r) => r.id === id);
    if (idx < 0) return false;

    const row = rows[idx];
    const policy = this.cancellationPolicy();
    const { remainingRefundableDays, refundableBaseKd } = computeRefundableBase(
      row.amountPaidKd,
      row.totalDays,
      row.usedDays,
      policy.operationalDeductionDays,
    );
    const clamped = clampFeePct(feePct);
    const { cancellationFeeKd, netRefundKd } = applyManualCancellationFee(
      refundableBaseKd,
      clamped,
    );

    const next: CancellationRequestRow = {
      ...row,
      remainingRefundableDays,
      refundableBaseKd,
      cancellationFeePct: clamped,
      cancellationFeeKd,
      netRefundKd,
      feeConfigured: true,
    };

    this.cancellationRequests.update((list) => list.map((r, i) => (i === idx ? next : r)));
    return true;
  }

  approveCancellation(id: string): boolean {
    const rows = this.cancellationRequests();
    const idx = rows.findIndex((r) => r.id === id);
    if (idx < 0) return false;
    const row = rows[idx];
    if (!row.canApprove || !row.feeConfigured) return false;

    const next: CancellationRequestRow = {
      ...row,
      status: row.refundMethod === 'Wallet' ? 'Processing' : 'Approved',
      statusAr:
        row.refundMethod === 'Wallet' ? 'جاري التحويل للمحفظة' : 'معتمد — بانتظار التحويل',
      statusEn:
        row.refundMethod === 'Wallet'
          ? 'Processing wallet credit'
          : 'Approved — awaiting payout',
      canApprove: false,
      canReject: false,
      canComplete: row.refundMethod === 'Wallet',
      hasDispute: false,
    };

    this.cancellationRequests.update((list) => list.map((r, i) => (i === idx ? next : r)));
    this.refreshStats();
    return true;
  }

  rejectCancellation(id: string): boolean {
    const rows = this.cancellationRequests();
    const idx = rows.findIndex((r) => r.id === id);
    if (idx < 0) return false;
    const row = rows[idx];
    if (!row.canReject) return false;

    const next: CancellationRequestRow = {
      ...row,
      status: 'Rejected',
      statusAr: 'مرفوض — لا استرداد',
      statusEn: 'Rejected — no refund',
      canApprove: false,
      canReject: false,
      canComplete: false,
    };

    this.cancellationRequests.update((list) => list.map((r, i) => (i === idx ? next : r)));
    this.refreshStats();
    return true;
  }

  completeRefund(id: string): boolean {
    const rows = this.cancellationRequests();
    const idx = rows.findIndex((r) => r.id === id);
    if (idx < 0) return false;
    const row = rows[idx];
    if (!row.canComplete) return false;

    const next: CancellationRequestRow = {
      ...row,
      status: 'Completed',
      statusAr: 'مكتمل — تم الاسترداد',
      statusEn: 'Completed — refunded',
      canApprove: false,
      canReject: false,
      canComplete: false,
    };

    this.cancellationRequests.update((list) => list.map((r, i) => (i === idx ? next : r)));
    this.refreshStats();
    return true;
  }

  private refreshStats(): void {
    const rows = this.cancellationRequests();
    const completed = rows.filter((r) => r.status === 'Completed');
    this.cancellationStats.set({
      pendingReview: rows.filter((r) => r.status === 'PendingReview').length,
      processing: rows.filter(
        (r) => r.status === 'Processing' || r.status === 'Approved',
      ).length,
      completedThisMonth: completed.length,
      totalRefundedThisMonth: completed.reduce((sum, r) => sum + r.netRefundKd, 0),
    });
  }
}
