export type PromoCodeSource = 'influencer' | 'campaign' | 'customer_referral';

export type PromoDiscountType = 'percent' | 'fixed';

export type PromoCodeStatus = 'Active' | 'Inactive' | 'Expired' | 'Exhausted';

export interface PromoCode {
  id: string;
  code: string;
  source: PromoCodeSource;
  sourceId?: string | null;
  sourceLabelAr: string;
  sourceLabelEn: string;
  discountType: PromoDiscountType;
  discountValue: number;
  startAtUtc: string;
  endAtUtc: string;
  usageLimit: number | null;
  usageCount: number;
  status: PromoCodeStatus;
  campaignId?: string | null;
}
