export type CancellationStatus =
  | 'PendingReview'
  | 'Approved'
  | 'Processing'
  | 'Completed'
  | 'Rejected'
  | 'Dispute';

export type RefundMethod = 'Wallet' | 'BankTransfer' | 'Card';

export type SubscriptionTypeKind = 'Individual' | 'Family';

export interface CancellationPolicy {
  defaultCancellationFeePct: number;
  operationalDeductionDays: number;
  updatedAt: string;
  updatedByAr: string;
  updatedByEn: string;
}

export interface CancellationStats {
  pendingReview: number;
  processing: number;
  completedThisMonth: number;
  totalRefundedThisMonth: number;
}

export interface CancellationRequestRow {
  id: string;
  customerId: string;
  customerNameAr: string;
  customerNameEn: string;
  subscriptionId: string;
  subscriptionType: SubscriptionTypeKind;
  subscriptionTypeAr: string;
  subscriptionTypeEn: string;
  programAr: string;
  programEn: string;
  bundleAr: string;
  bundleEn: string;
  tierAr: string;
  tierEn: string;
  subscriptionStartDateAr: string;
  subscriptionStartDateEn: string;
  requestedAt: string;
  requestedAtAr: string;
  requestedAtEn: string;
  totalDays: number;
  usedDays: number;
  amountPaidKd: number;
  remainingRefundableDays: number;
  refundableBaseKd: number;
  /** Admin-set cancellation fee percentage (0–100). */
  cancellationFeePct: number | null;
  cancellationFeeKd: number;
  netRefundKd: number;
  feeConfigured: boolean;
  refundMethod: RefundMethod;
  refundMethodAr: string;
  refundMethodEn: string;
  status: CancellationStatus;
  statusAr: string;
  statusEn: string;
  isHighValue: boolean;
  needsSuperAdminApproval: boolean;
  hasDispute: boolean;
  disputeNoteAr?: string;
  disputeNoteEn?: string;
  customerReasonAr: string;
  customerReasonEn: string;
  canApprove: boolean;
  canReject: boolean;
  canComplete: boolean;
}
