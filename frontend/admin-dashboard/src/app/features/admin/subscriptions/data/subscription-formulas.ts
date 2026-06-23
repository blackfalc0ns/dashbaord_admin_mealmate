import { RestaurantTier, SingleRestaurantBounds } from '../models';

const ACTIVE_DAYS_PER_MONTH = 26;
const MIN_PROFIT_KD = 0.5;

export function dailyPriceFrom26(price26: number): number {
  return price26 / ACTIVE_DAYS_PER_MONTH;
}

export function commissionPct(days: number, maxPct: number, minPct: number): number {
  if (days >= ACTIVE_DAYS_PER_MONTH) return minPct;
  return maxPct - ((maxPct - minPct) / 25) * (days - 1);
}

export function customerBasePrice(avgDailyKd: number, days: number, commissionPctValue: number): number {
  const daily = avgDailyKd * (1 + commissionPctValue / 100);
  return Math.ceil(daily * days);
}

export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function stdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const m = mean(values);
  const variance = values.reduce((sum, v) => sum + (v - m) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

export function classifyTier(
  dailyKd: number,
  groupDailyPrices: number[],
  bounds: SingleRestaurantBounds,
): RestaurantTier {
  if (groupDailyPrices.length === 1) {
    if (dailyKd < bounds.basicMaxDailyKd) return 'basic';
    if (dailyKd >= bounds.eliteMinDailyKd) return 'elite';
    return 'platinum';
  }
  const m = mean(groupDailyPrices);
  const s = stdDev(groupDailyPrices);
  if (dailyKd <= m - 0.5 * s) return 'basic';
  if (dailyKd >= m + 0.5 * s) return 'elite';
  return 'platinum';
}

export function expectedProfitKd(
  customerDailyKd: number,
  restaurantDailyKd: number,
  restaurantCommissionPct: number,
): number {
  const netRestaurantCost = restaurantDailyKd * (1 - restaurantCommissionPct / 100);
  return customerDailyKd - netRestaurantCost;
}

export function isOutlier(
  dailyKd: number,
  groupDailyPrices: number[],
  customerDailyKd: number,
  restaurantCommissionPct: number,
): boolean {
  if (groupDailyPrices.length < 2) return false;
  const m = mean(groupDailyPrices);
  const s = stdDev(groupDailyPrices);
  const profit = expectedProfitKd(customerDailyKd, dailyKd, restaurantCommissionPct);
  return dailyKd > m + s && profit < MIN_PROFIT_KD;
}

export function netProfitPct(customerTotal: number, restaurantCostTotal: number): number {
  if (restaurantCostTotal <= 0) return 0;
  return ((customerTotal - restaurantCostTotal) / restaurantCostTotal) * 100;
}

export { ACTIVE_DAYS_PER_MONTH, MIN_PROFIT_KD };
