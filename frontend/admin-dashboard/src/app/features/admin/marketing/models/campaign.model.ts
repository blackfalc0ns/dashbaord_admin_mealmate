/** M11 — Collaborative discount campaigns (per MealMate PDF spec). */

export type CollaborativeCampaignStatus =
  | 'Draft'
  | 'OpenForJoin'
  | 'Reviewed'
  | 'Active'
  | 'Stopped';

export type CampaignCommissionOption = 'full' | 'half' | 'none';

export type ParticipantEnrollmentStatus = 'Pending' | 'Agreed' | 'Declined';

export interface CampaignAuditEvent {
  id: string;
  action: string;
  actionAr: string;
  actionEn: string;
  actor: string;
  atUtc: string;
  detailAr?: string;
  detailEn?: string;
}

export interface CampaignPerformancePoint {
  labelAr: string;
  labelEn: string;
  usages: number;
  revenueKd: number;
  newSubs: number;
}

export interface SystemBundleOption {
  id: string;
  labelAr: string;
  labelEn: string;
  programAr: string;
  programEn: string;
}

export interface CampaignBundle {
  id: string;
  nameAr: string;
  nameEn: string;
  linkedBundleId: string;
  linkedBundleLabelAr: string;
  linkedBundleLabelEn: string;
}

export interface CampaignProgram {
  id: string;
  nameAr: string;
  nameEn: string;
  bundles: CampaignBundle[];
}

export interface CampaignParticipant {
  id: string;
  campaignBundleId: string;
  bundleLabelAr: string;
  bundleLabelEn: string;
  restaurantId: string;
  restaurantNameAr: string;
  restaurantNameEn: string;
  originalDailyPrice: number;
  discountedDailyPrice: number;
  netDailyPrice: number;
  campaignDailyCapacity: number;
  enrollmentStatus: ParticipantEnrollmentStatus;
  agreedToIncrease: boolean;
  additionalCapacity: number;
}

export interface CampaignReviewTier {
  tier: 'Basic' | 'Platinum' | 'Elite';
  restaurantCount: number;
  avgDiscountedDailyPrice: number;
}

export interface CollaborativeCampaign {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  status: CollaborativeCampaignStatus;
  totalDiscountPercent: number;
  restaurantSharePercent: number;
  platformSharePercent: number;
  commissionOption: CampaignCommissionOption;
  startAtUtc: string;
  endAtUtc: string;
  maxSubscribers: number;
  originalMaxSubscribers: number;
  currentSubscribers: number;
  stoppedAtUtc?: string | null;
  programs: CampaignProgram[];
  participants: CampaignParticipant[];
  reviewTiers?: CampaignReviewTier[];
  performanceTrend?: CampaignPerformancePoint[];
  auditLog: CampaignAuditEvent[];
  createdAtUtc: string;
  createdByAdminId: string;
}

export interface CampaignBundleInput {
  nameAr: string;
  nameEn: string;
  linkedBundleId: string;
}

export interface CampaignProgramInput {
  nameAr: string;
  nameEn: string;
  bundles: CampaignBundleInput[];
}

export interface CreateCollaborativeCampaignPayload {
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  totalDiscountPercent: number;
  restaurantSharePercent: number;
  platformSharePercent: number;
  commissionOption: CampaignCommissionOption;
  startAtUtc: string;
  endAtUtc: string;
  maxSubscribers: number;
  programs: CampaignProgramInput[];
  sendToRestaurants: boolean;
}

/** @deprecated Use CollaborativeCampaign — kept for transitional imports */
export type MarketingCampaign = CollaborativeCampaign;
export type CampaignStatus = CollaborativeCampaignStatus;
export type CreateCampaignPayload = CreateCollaborativeCampaignPayload;
