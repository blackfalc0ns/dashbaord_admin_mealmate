export type UpgradeTier = 'basic' | 'platinum' | 'elite';

export type UpgradeStatus =
  | 'Pending'
  | 'InProgress'
  | 'NeedsReview'
  | 'Completed'
  | 'Rejected';

export type UpgradeSource = 'Customer' | 'FamilyDetach' | 'Admin';

export interface UpgradePolicy {
  prorateRemainingDays: boolean;
  requireReviewForElite: boolean;
  savePricingSnapshot: boolean;
  updatedAt: string;
  updatedByAr: string;
  updatedByEn: string;
}

export interface UpgradeRequestRow {
  id: string;
  customerId: string;
  customerNameAr: string;
  customerNameEn: string;
  subscriptionId: string;
  programAr: string;
  programEn: string;
  bundleAr: string;
  bundleEn: string;
  currentTier: UpgradeTier;
  currentTierAr: string;
  currentTierEn: string;
  targetTier: UpgradeTier;
  targetTierAr: string;
  targetTierEn: string;
  subscriptionDays: number;
  usedDays: number;
  remainingDays: number;
  currentPriceKd: number;
  targetTierPriceKd: number;
  proratedDifferenceKd: number;
  status: UpgradeStatus;
  statusAr: string;
  statusEn: string;
  source: UpgradeSource;
  sourceAr: string;
  sourceEn: string;
  requestedAtAr: string;
  requestedAtEn: string;
  restaurantAccessGainAr: string;
  restaurantAccessGainEn: string;
  hasSnapshot: boolean;
  canApprove: boolean;
  canReject: boolean;
  completedAtAr: string | null;
  completedAtEn: string | null;
  rejectReasonAr: string | null;
  rejectReasonEn: string | null;
}

export interface UpgradeStats {
  pendingRequests: number;
  inProgress: number;
  needsReview: number;
  completedThisMonth: number;
  upgradeRevenueKd: number;
}
