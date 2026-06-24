import { CollaborativeCampaign, CreateCollaborativeCampaignPayload } from '../models';

export function validateDiscountSplit(
  total: number,
  restaurant: number,
  platform: number,
): boolean {
  return Math.abs(total - (restaurant + platform)) < 0.001;
}

export function calcDiscountedDailyPrice(original: number, restaurantSharePercent: number): number {
  return Math.round(original * (1 - restaurantSharePercent / 100) * 100) / 100;
}

export function calcNetDailyPrice(discounted: number, commissionOption: CollaborativeCampaign['commissionOption']): number {
  const factor = commissionOption === 'half' ? 0.95 : commissionOption === 'full' ? 0.9 : 1;
  return Math.round(discounted * factor * 100) / 100;
}

export function totalCampaignCapacity(campaign: CollaborativeCampaign): number {
  return campaign.participants
    .filter((p) => p.enrollmentStatus === 'Agreed')
    .reduce((sum, p) => sum + p.campaignDailyCapacity + p.additionalCapacity, 0);
}

export function capacityMeetsTarget(campaign: CollaborativeCampaign): boolean {
  return totalCampaignCapacity(campaign) >= campaign.maxSubscribers;
}

export function canLaunch(campaign: CollaborativeCampaign): boolean {
  return campaign.status === 'Reviewed' && capacityMeetsTarget(campaign);
}

export function discountSplitError(payload: Pick<
  CreateCollaborativeCampaignPayload,
  'totalDiscountPercent' | 'restaurantSharePercent' | 'platformSharePercent'
>): boolean {
  return !validateDiscountSplit(
    payload.totalDiscountPercent,
    payload.restaurantSharePercent,
    payload.platformSharePercent,
  );
}

/** PDF §7 example pricing ladder for a tier average daily price */
export function calcCampaignPricePreview(
  avgDiscountedDaily: number,
  platformSharePercent: number,
  durationDays = 26,
  upsellPercent = 20,
): {
  basePrice: number;
  finalPrice: number;
  boxTotal: number;
  profit: number;
} {
  const basePrice = Math.ceil(avgDiscountedDaily * (1 + upsellPercent / 100) * durationDays);
  const finalPrice = Math.ceil(basePrice * (1 - platformSharePercent / 100));
  const boxTotal = Math.round(avgDiscountedDaily * 0.95 * durationDays * 100) / 100;
  const profit = Math.round((finalPrice - boxTotal) * 100) / 100;
  return { basePrice, finalPrice, boxTotal, profit };
}
