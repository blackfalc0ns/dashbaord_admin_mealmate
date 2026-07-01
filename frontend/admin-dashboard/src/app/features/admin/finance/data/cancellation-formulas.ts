export interface RefundableBaseResult {
  remainingRefundableDays: number;
  refundableBaseKd: number;
}

export function remainingRefundableDays(
  totalDays: number,
  usedDays: number,
  operationalDeductionDays: number,
): number {
  return Math.max(totalDays - usedDays - operationalDeductionDays, 0);
}

export function computeRefundableBase(
  amountPaidKd: number,
  totalDays: number,
  usedDays: number,
  operationalDeductionDays: number,
): RefundableBaseResult {
  const days = remainingRefundableDays(totalDays, usedDays, operationalDeductionDays);
  const refundableBaseKd = totalDays > 0 ? (amountPaidKd / totalDays) * days : 0;

  return { remainingRefundableDays: days, refundableBaseKd };
}

export function applyManualCancellationFee(
  refundableBaseKd: number,
  feePct: number,
): { cancellationFeeKd: number; netRefundKd: number } {
  const clamped = Math.max(0, Math.min(100, feePct));
  const cancellationFeeKd = refundableBaseKd * (clamped / 100);
  return {
    cancellationFeeKd,
    netRefundKd: Math.max(0, refundableBaseKd - cancellationFeeKd),
  };
}

export function clampFeePct(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, value));
}
