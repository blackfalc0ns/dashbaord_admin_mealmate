export type AdPlacementType =
  | 'home_banner'
  | 'restaurant_list_sponsored'
  | 'area_page_bid'
  | 'restaurant_detail_highlight';

export type AdSlotStatus = 'Open' | 'ClosingSoon' | 'Awarded' | 'Live' | 'Paused' | 'Expired';

export type AdBidStatus = 'Pending' | 'Leading' | 'Winning' | 'Approved' | 'Outbid' | 'Rejected';

export interface AdSlot {
  id: string;
  areaId: string;
  areaNameAr: string;
  areaNameEn: string;
  placement: AdPlacementType;
  status: AdSlotStatus;
  maxWinners: number;
  minBidKd: number;
  startAtUtc: string;
  endAtUtc: string;
  impressions: number;
  clicks: number;
  revenueKd: number;
  winnerBidIds: string[];
}

export interface RestaurantAdCreative {
  headlineAr: string;
  headlineEn: string;
  descriptionAr: string;
  descriptionEn: string;
  ctaAr: string;
  ctaEn: string;
  imageTone: string;
}

export interface RestaurantAdBid {
  id: string;
  slotId: string;
  restaurantId: string;
  restaurantNameAr: string;
  restaurantNameEn: string;
  serviceAreasAr: string[];
  serviceAreasEn: string[];
  bidAmountKd: number;
  dailyBudgetKd: number;
  qualityScore: number;
  status: AdBidStatus;
  submittedAtUtc: string;
  reviewedAtUtc?: string | null;
  rejectionReasonAr?: string | null;
  rejectionReasonEn?: string | null;
  creative: RestaurantAdCreative;
}

export interface AdPolicyRule {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  severity: 'info' | 'warning' | 'danger';
}

export interface AdAuditEvent {
  id: string;
  action: string;
  actionAr: string;
  actionEn: string;
  actor: string;
  atUtc: string;
  detailAr?: string;
  detailEn?: string;
}

export interface AdBiddingKpis {
  openAuctions: number;
  liveSlots: number;
  pendingReview: number;
  totalRevenueKd: number;
  averageCtr: number;
  policyIssues: number;
}

export interface AdAreaOption {
  id: string;
  nameAr: string;
  nameEn: string;
}

export interface CreateAdSlotPayload {
  areaId: string;
  areaNameAr: string;
  areaNameEn: string;
  placement: AdPlacementType;
  maxWinners: number;
  minBidKd: number;
  startAtUtc: string;
  endAtUtc: string;
}
