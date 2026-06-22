import type { ApexAxisChartSeries } from 'ng-apexcharts';

import type { DriverAccount, RestaurantAccount } from '../models/accounts.model';

export interface RestaurantAnalyticsSnapshot {
  grossRevenue: number;
  platformCommission: number;
  netSettlement: number;
  platformCommissionRate: number;
  avgDailyMeals: number;
  capacityUtilization: number;
  weeklyRevenue: { categories: string[]; series: ApexAxisChartSeries };
  dailyMeals: { categories: string[]; series: ApexAxisChartSeries };
  settlementBreakdown: { labels: string[]; series: number[] };
  slaTrend: { categories: string[]; series: ApexAxisChartSeries };
}

export interface DriverAnalyticsSnapshot {
  totalDeliveries: number;
  successRate: number;
  barcodeScanRate: number;
  avgDailyDeliveries: number;
  weeklyDeliveries: { categories: string[]; series: ApexAxisChartSeries };
  dailyDeliveries: { categories: string[]; series: ApexAxisChartSeries };
  deliveryOutcomes: { labels: string[]; series: number[] };
  onTimeTrend: { categories: string[]; series: ApexAxisChartSeries };
}

function hashId(id: string): number {
  return [...id].reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function roundKwd(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function utilizationForRestaurant(restaurant: RestaurantAccount, seed: number): number {
  if (restaurant.status === 'Active') return 0.68 + (seed % 17) / 100;
  if (restaurant.status === 'Suspended' || restaurant.status === 'Terminated') return 0.08 + (seed % 12) / 100;
  if (restaurant.status === 'NeedsOperationalSetup' || restaurant.status === 'ReadyToGoLive') {
    return 0.22 + (seed % 18) / 100;
  }
  return 0.42 + (seed % 20) / 100;
}

const SERVICE_DAYS_AR = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'السبت'];
const SERVICE_DAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Sat'];

const WEEKS_AR = ['الأسبوع 1', 'الأسبوع 2', 'الأسبوع 3', 'الأسبوع 4'];
const WEEKS_EN = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

const SLA_WEEKS_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'];
const SLA_WEEKS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

export function formatKwd(amount: number): string {
  return `${amount.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 })} د.ك`;
}

export function buildRestaurantAnalytics(
  restaurant: RestaurantAccount,
  rtl: boolean,
): RestaurantAnalyticsSnapshot {
  const seed = hashId(restaurant.id);
  const utilization = utilizationForRestaurant(restaurant, seed);
  const avgDailyMeals = Math.max(8, Math.round(restaurant.dailyCapacity * utilization));
  const dailyBoxPrice = 4.65 + (seed % 16) * 0.11;
  const platformCommissionRate = 0.15;
  const activeDaysPerWeek = 6;

  const weeklyTotals = Array.from({ length: 4 }, (_, week) => {
    const variance = 1 + ((seed + week * 11) % 13 - 6) / 100;
    return roundKwd(avgDailyMeals * dailyBoxPrice * activeDaysPerWeek * variance);
  });

  const grossRevenue = roundKwd(weeklyTotals.reduce((sum, value) => sum + value, 0));
  const platformCommission = roundKwd(grossRevenue * platformCommissionRate);
  const netSettlement = roundKwd(grossRevenue - platformCommission);

  const dailyMealCounts = Array.from({ length: 6 }, (_, day) => {
    const swing = ((seed + day * 5) % 9) - 4;
    return Math.max(12, avgDailyMeals + swing);
  });

  const slaBaseConfirm = restaurant.status === 'Active' ? 97.8 + (seed % 15) / 10 : 88 + (seed % 8);
  const slaBasePrep = restaurant.status === 'Active' ? 96.5 + (seed % 20) / 10 : 85 + (seed % 10);

  return {
    grossRevenue,
    platformCommission,
    netSettlement,
    platformCommissionRate,
    avgDailyMeals,
    capacityUtilization: Math.round(utilization * 1000) / 10,
    weeklyRevenue: {
      categories: rtl ? WEEKS_AR : WEEKS_EN,
      series: [
        {
          name: rtl ? 'إيرادات الوجبات (د.ك)' : 'Meal Revenue (KWD)',
          data: weeklyTotals,
        },
      ],
    },
    dailyMeals: {
      categories: rtl ? SERVICE_DAYS_AR : SERVICE_DAYS_EN,
      series: [
        {
          name: rtl ? 'وجبات موزعة' : 'Meals Delivered',
          data: dailyMealCounts,
        },
      ],
    },
    settlementBreakdown: {
      labels: rtl
        ? ['صافي مستحقات المطعم', 'عمولة المنصة']
        : ['Restaurant Net', 'Platform Commission'],
      series: [netSettlement, platformCommission],
    },
    slaTrend: {
      categories: rtl ? SLA_WEEKS_AR : SLA_WEEKS_EN,
      series: [
        {
          name: rtl ? 'تأكيد خلال 24 ساعة %' : '24h Confirmation %',
          data: Array.from({ length: 6 }, (_, i) =>
            roundKwd(Math.min(100, slaBaseConfirm + ((seed + i) % 5) * 0.2)),
          ),
        },
        {
          name: rtl ? 'تجهيز في الوقت %' : 'On-Time Prep %',
          data: Array.from({ length: 6 }, (_, i) =>
            roundKwd(Math.min(100, slaBasePrep + ((seed + i * 2) % 6) * 0.25)),
          ),
        },
      ],
    },
  };
}

export function buildDriverAnalytics(driver: DriverAccount, rtl: boolean): DriverAnalyticsSnapshot {
  const seed = hashId(driver.id);
  const isActive = driver.status === 'Active';
  const avgDailyDeliveries = isActive ? 14 + (seed % 9) : 3 + (seed % 5);

  const weeklyDeliveryCounts = Array.from({ length: 4 }, (_, week) => {
    const variance = ((seed + week * 7) % 7) - 3;
    return Math.max(48, avgDailyDeliveries * 6 + variance * 4);
  });

  const totalDeliveries = weeklyDeliveryCounts.reduce((sum, value) => sum + value, 0);
  const successRate = isActive ? roundKwd(97.5 + (seed % 25) / 10) : roundKwd(84 + (seed % 10));
  const barcodeScanRate = isActive ? 100 : roundKwd(91 + (seed % 8));

  const dailyDeliveryCounts = Array.from({ length: 6 }, (_, day) => {
    const swing = ((seed + day * 4) % 7) - 3;
    return Math.max(8, avgDailyDeliveries + swing);
  });

  const delivered = isActive ? 96 + (seed % 4) : 72 + (seed % 8);
  const pickedUp = isActive ? 2 + (seed % 2) : 8 + (seed % 5);
  const failed = Math.max(1, 100 - delivered - pickedUp);

  const onTimeBase = isActive ? 95.5 + (seed % 25) / 10 : 82 + (seed % 10);

  return {
    totalDeliveries,
    successRate,
    barcodeScanRate,
    avgDailyDeliveries,
    weeklyDeliveries: {
      categories: rtl ? WEEKS_AR : WEEKS_EN,
      series: [
        {
          name: rtl ? 'طلبات التوصيل' : 'Deliveries',
          data: weeklyDeliveryCounts,
        },
      ],
    },
    dailyDeliveries: {
      categories: rtl ? SERVICE_DAYS_AR : SERVICE_DAYS_EN,
      series: [
        {
          name: rtl ? 'توصيلات يومية' : 'Daily Deliveries',
          data: dailyDeliveryCounts,
        },
      ],
    },
    deliveryOutcomes: {
      labels: rtl
        ? ['تم التسليم', 'قيد التنفيذ', 'فشل / إعادة']
        : ['Delivered', 'In Progress', 'Failed / Return'],
      series: [delivered, pickedUp, failed],
    },
    onTimeTrend: {
      categories: rtl ? SLA_WEEKS_AR : SLA_WEEKS_EN,
      series: [
        {
          name: rtl ? 'التوصيل في الوقت %' : 'On-Time Delivery %',
          data: Array.from({ length: 6 }, (_, i) =>
            roundKwd(Math.min(100, onTimeBase + ((seed + i) % 6) * 0.3)),
          ),
        },
      ],
    },
  };
}
