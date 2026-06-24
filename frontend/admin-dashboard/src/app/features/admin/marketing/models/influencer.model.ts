export type InfluencerStatus =
  | 'Draft'
  | 'Active'
  | 'Paused'
  | 'Suspended'
  | 'BlockedForFraud'
  | 'Closed';

export type PayoutInfoStatus = 'NotProvided' | 'PendingReview' | 'Verified' | 'Rejected';

export type PromotionAssetStatus = 'Active' | 'Inactive' | 'Expired';

export type AttributionSourceType = 'link' | 'code';

export type CommissionRecordStatus = 'Pending' | 'Paid' | 'Reversed';

export interface SocialChannel {
  platform: string;
  handle: string;
  url?: string;
}

export interface InfluencerPromotionLink {
  id: string;
  slug: string;
  targetUrl: string;
  status: PromotionAssetStatus;
  startAtUtc: string;
  endAtUtc?: string | null;
}

export interface InfluencerPromotionCode {
  id: string;
  code: string;
  status: PromotionAssetStatus;
  startAtUtc: string;
  endAtUtc?: string | null;
  usageLimit?: number | null;
  usageCount: number;
}

export interface ReferralAttribution {
  id: string;
  customerId: string;
  customerNameAr: string;
  customerNameEn: string;
  subscriptionId: string;
  sourceType: AttributionSourceType;
  sourceValue: string;
  attributedAtUtc: string;
}

export interface InfluencerCommission {
  id: string;
  subscriptionId: string;
  subscriptionAmount: number;
  appliedCommissionRate: number;
  commissionAmount: number;
  status: CommissionRecordStatus;
  paidAtUtc?: string | null;
  createdAtUtc: string;
}

export interface CommissionRateChange {
  id: string;
  previousRate: number;
  newRate: number;
  changedAtUtc: string;
  changedBy: string;
  reason?: string;
}

export interface InfluencerAuditEvent {
  id: string;
  action: string;
  actionAr: string;
  actionEn: string;
  actor: string;
  atUtc: string;
  detailAr?: string;
  detailEn?: string;
}

export interface InfluencerPerformancePoint {
  labelAr: string;
  labelEn: string;
  referrals: number;
  paidSubscriptions: number;
  commissionKd: number;
}

export interface InfluencerChannelStats {
  linkVisits: number;
  codeRedemptions: number;
  linkConversions: number;
  codeConversions: number;
}

export interface InfluencerProfile {
  id: string;
  userId?: string | null;
  displayNameAr: string;
  displayNameEn: string;
  contactPhone: string;
  contactEmail: string;
  socialChannels: SocialChannel[];
  payoutInfoStatus: PayoutInfoStatus;
  status: InfluencerStatus;
  defaultCommissionRate: number;
  promotionLink?: InfluencerPromotionLink | null;
  promotionCode?: InfluencerPromotionCode | null;
  stats: {
    referralsCount: number;
    paidSubscriptionsCount: number;
    pendingCommissionTotal: number;
    paidCommissionTotal: number;
    conversionRate: number;
  };
  lastActivityAtUtc: string;
  createdAtUtc: string;
  createdByAdminId: string;
  attributions: ReferralAttribution[];
  commissions: InfluencerCommission[];
  commissionRateHistory: CommissionRateChange[];
  auditLog: InfluencerAuditEvent[];
  performanceTrend?: InfluencerPerformancePoint[];
  channelStats?: InfluencerChannelStats;
}

export interface CreateInfluencerPayload {
  displayNameAr: string;
  displayNameEn: string;
  contactPhone: string;
  contactEmail: string;
  userId?: string | null;
  socialChannels: SocialChannel[];
  slug: string;
  code: string;
  defaultCommissionRate: number;
  activateNow: boolean;
}
