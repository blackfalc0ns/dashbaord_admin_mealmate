export type RestaurantTier = 'basic' | 'platinum' | 'elite';

export type OutlierActionType = 'keep' | 'move_higher' | 'exclude';

export interface SingleRestaurantBounds {
  basicMaxDailyKd: number;
  eliteMinDailyKd: number;
}

export interface RestaurantPriceRow {
  restaurantId: string;
  restaurantName: string;
  programId: string;
  programNameAr: string;
  programNameEn: string;
  bundleId: string;
  bundleNameAr: string;
  bundleNameEn: string;
  price26DaysKd: number;
  restaurantSettlementCommissionPct: number;
}

export interface ClassificationRow {
  restaurantId: string;
  restaurantName: string;
  programId: string;
  programNameAr: string;
  programNameEn: string;
  bundleId: string;
  bundleNameAr: string;
  bundleNameEn: string;
  price26DaysKd: number;
  dailyPriceKd: number;
  meanKd: number;
  stdDevKd: number;
  tier: RestaurantTier;
  restaurantCountInGroup: number;
  isOutlier: boolean;
  expectedProfitKd: number;
  customerDailyPriceKd: number;
  adminOverrideTier: RestaurantTier | null;
  isExcluded: boolean;
}

export interface OutlierAuditLog {
  id: string;
  restaurantId: string;
  restaurantName: string;
  programId: string;
  bundleId: string;
  action: OutlierActionType;
  reason: string;
  actorName: string;
  appliedAt: string;
}
