import { RestaurantTier } from './classification.model';

export interface PlatformCommissionBounds {
  maxCommissionPct: number;
  minCommissionPct: number;
}

export type PlatformCommissionMode = 'global' | 'per_bundle';

export interface PlatformCommissionConfig {
  mode: PlatformCommissionMode;
  global: PlatformCommissionBounds;
  perBundle: Record<string, PlatformCommissionBounds>;
}

export interface TierAverageRow {
  programId: string;
  programNameAr: string;
  programNameEn: string;
  bundleId: string;
  bundleNameAr: string;
  bundleNameEn: string;
  tier: RestaurantTier;
  restaurantCount: number;
  avgPrice26DaysKd: number;
  avgDailyPriceKd: number;
  customerPrice6DaysKd: number;
  customerPrice12DaysKd: number;
  customerPrice26DaysKd: number;
  commission6Pct: number;
  commission12Pct: number;
  commission26Pct: number;
}

export interface RestaurantCommissionRow {
  restaurantId: string;
  restaurantName: string;
  settlementCommissionPct: number;
  updatedAt: string;
}

export interface ProfitabilityAlert {
  id: string;
  severity: 'warning' | 'danger';
  programId: string;
  programNameAr: string;
  programNameEn: string;
  bundleId: string;
  bundleNameAr: string;
  bundleNameEn: string;
  netProfitPct: number;
  messageAr: string;
  messageEn: string;
  restaurantId?: string;
  restaurantName?: string;
}

export interface RecalculationEvent {
  id: string;
  type: 'price_change' | 'restaurant_join' | 'bounds_change' | 'commission_change';
  summaryAr: string;
  summaryEn: string;
  at: string;
}
