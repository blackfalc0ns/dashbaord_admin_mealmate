import {
  MealBundle,
  NutritionProgram,
  OutlierAuditLog,
  PlatformCommissionBounds,
  PlatformCommissionConfig,
  PlatformCommissionMode,
  RecalculationEvent,
  RestaurantCommissionRow,
  RestaurantPriceRow,
  SingleRestaurantBounds,
  SubscriptionDuration,
} from '../models';

export const DURATIONS_MOCK: SubscriptionDuration[] = [
  { id: 'DUR-26', nameAr: 'شهري', nameEn: 'Monthly', days: 26, isCustom: false, status: 'active', commissionAtDays: 15, createdAt: '2025-01-10T08:00:00+03:00', updatedAt: '2025-06-01T09:00:00+03:00' },
  { id: 'DUR-12', nameAr: 'أسبوعين', nameEn: '2 weeks', days: 12, isCustom: false, status: 'active', commissionAtDays: 22.2, createdAt: '2025-01-10T08:00:00+03:00', updatedAt: '2025-06-01T09:00:00+03:00' },
  { id: 'DUR-6', nameAr: 'أسبوع', nameEn: '1 week', days: 6, isCustom: false, status: 'active', commissionAtDays: 27, createdAt: '2025-01-10T08:00:00+03:00', updatedAt: '2025-06-01T09:00:00+03:00' },
  { id: 'DUR-CUSTOM', nameAr: 'مخصص', nameEn: 'Custom', days: 0, isCustom: true, status: 'active', commissionAtDays: 30, createdAt: '2025-03-01T08:00:00+03:00', updatedAt: '2025-06-10T11:00:00+03:00' },
];

export const PROGRAMS_MOCK: NutritionProgram[] = [
  {
    id: 'PRG-001',
    nameAr: 'رشاقة',
    nameEn: 'Cutting',
    descriptionAr: 'برنامج إنقاص الوزن بعجز سعرات محسوب',
    descriptionEn: 'Calorie deficit program for weight loss',
    status: 'active',
    pricedRestaurantCount: 7,
    activeSubscriptionCount: 842,
    countryCode: 'KW',
    createdAt: '2025-01-15T10:00:00+03:00',
    updatedAt: '2025-06-18T14:30:00+03:00',
  },
  {
    id: 'PRG-002',
    nameAr: 'ضخامة',
    nameEn: 'Bulking',
    descriptionAr: 'زيادة كتلة عضلية ببروتين عالي',
    descriptionEn: 'High-protein muscle gain program',
    status: 'active',
    pricedRestaurantCount: 6,
    activeSubscriptionCount: 518,
    countryCode: 'KW',
    createdAt: '2025-01-15T10:00:00+03:00',
    updatedAt: '2025-06-12T09:15:00+03:00',
  },
  {
    id: 'PRG-003',
    nameAr: 'محافظة',
    nameEn: 'Maintain',
    descriptionAr: 'توازن سعرات للحفاظ على الوزن',
    descriptionEn: 'Balanced maintenance program',
    status: 'active',
    pricedRestaurantCount: 5,
    activeSubscriptionCount: 312,
    countryCode: 'KW',
    createdAt: '2025-02-01T08:00:00+03:00',
    updatedAt: '2025-06-08T16:00:00+03:00',
  },
  {
    id: 'PRG-004',
    nameAr: 'كيتو',
    nameEn: 'Keto',
    descriptionAr: 'منخفض الكربوهيدرات وعالي الدهون الصحية',
    descriptionEn: 'Low-carb ketogenic program',
    status: 'active',
    pricedRestaurantCount: 4,
    activeSubscriptionCount: 196,
    countryCode: 'KW',
    createdAt: '2025-02-15T08:00:00+03:00',
    updatedAt: '2025-06-05T11:20:00+03:00',
  },
];

export const BUNDLES_MOCK: MealBundle[] = [
  {
    id: 'BND-001',
    nameAr: 'باقة كاملة',
    nameEn: 'Full bundle',
    components: { breakfast: true, mainMeals: 2, snack: true, salad: true },
    isCustom: false,
    status: 'active',
    pricedRestaurantCount: 7,
    activeSubscriptionCount: 920,
    isReady: true,
    createdAt: '2025-01-15T10:00:00+03:00',
    updatedAt: '2025-06-16T08:00:00+03:00',
  },
  {
    id: 'BND-002',
    nameAr: 'باقة الغداء',
    nameEn: 'Lunch bundle',
    components: { breakfast: false, mainMeals: 1, snack: false, salad: true },
    isCustom: false,
    status: 'active',
    pricedRestaurantCount: 6,
    activeSubscriptionCount: 640,
    isReady: true,
    createdAt: '2025-01-15T10:00:00+03:00',
    updatedAt: '2025-06-14T10:00:00+03:00',
  },
  {
    id: 'BND-003',
    nameAr: 'باقة مخصصة',
    nameEn: 'Custom bundle',
    components: { breakfast: true, mainMeals: 1, snack: true, salad: false },
    isCustom: true,
    status: 'active',
    pricedRestaurantCount: 3,
    activeSubscriptionCount: 118,
    isReady: false,
    createdAt: '2025-04-01T08:00:00+03:00',
    updatedAt: '2025-06-10T13:00:00+03:00',
  },
];

export const DEFAULT_SINGLE_BOUNDS: SingleRestaurantBounds = {
  basicMaxDailyKd: 4.5,
  eliteMinDailyKd: 6,
};

export const PLATFORM_COMMISSION_MOCK: PlatformCommissionBounds = {
  maxCommissionPct: 30,
  minCommissionPct: 15,
};

export const PLATFORM_COMMISSION_CONFIG_MOCK: PlatformCommissionConfig = {
  mode: 'global',
  global: { ...PLATFORM_COMMISSION_MOCK },
  perBundle: {
    'BND-001': { maxCommissionPct: 30, minCommissionPct: 15 },
    'BND-002': { maxCommissionPct: 28, minCommissionPct: 14 },
    'BND-003': { maxCommissionPct: 32, minCommissionPct: 16 },
  },
};

export const RESTAURANT_COMMISSIONS_MOCK: RestaurantCommissionRow[] = [
  { restaurantId: 'RST-001', restaurantName: 'مطبخ الصحة', settlementCommissionPct: 15, updatedAt: '2025-06-18T10:00:00+03:00' },
  { restaurantId: 'RST-002', restaurantName: 'Green Kitchen', settlementCommissionPct: 18, updatedAt: '2025-06-17T14:30:00+03:00' },
  { restaurantId: 'RST-003', restaurantName: 'Fit Meals Co.', settlementCommissionPct: 20, updatedAt: '2025-06-16T09:15:00+03:00' },
  { restaurantId: 'RST-004', restaurantName: 'Lean Bites', settlementCommissionPct: 22, updatedAt: '2025-06-20T08:00:00+03:00' },
  { restaurantId: 'RST-005', restaurantName: 'Protein House', settlementCommissionPct: 16, updatedAt: '2025-06-15T11:00:00+03:00' },
  { restaurantId: 'RST-006', restaurantName: 'Healthy Hub', settlementCommissionPct: 17, updatedAt: '2025-06-14T16:45:00+03:00' },
  { restaurantId: 'RST-007', restaurantName: 'NutriBox KW', settlementCommissionPct: 19, updatedAt: '2025-06-13T08:20:00+03:00' },
  { restaurantId: 'RST-008', restaurantName: 'Fresh Plate', settlementCommissionPct: 21, updatedAt: '2025-06-12T13:00:00+03:00' },
];

/** Restaurant-entered 26-day prices per program × bundle. */
export const RESTAURANT_PRICES_MOCK: RestaurantPriceRow[] = [
  // Cutting + Full — main classification group
  { restaurantId: 'RST-001', restaurantName: 'مطبخ الصحة', programId: 'PRG-001', programNameAr: 'رشاقة', programNameEn: 'Cutting', bundleId: 'BND-001', bundleNameAr: 'باقة كاملة', bundleNameEn: 'Full bundle', price26DaysKd: 104, restaurantSettlementCommissionPct: 15 },
  { restaurantId: 'RST-002', restaurantName: 'Green Kitchen', programId: 'PRG-001', programNameAr: 'رشاقة', programNameEn: 'Cutting', bundleId: 'BND-001', bundleNameAr: 'باقة كاملة', bundleNameEn: 'Full bundle', price26DaysKd: 117, restaurantSettlementCommissionPct: 18 },
  { restaurantId: 'RST-004', restaurantName: 'Lean Bites', programId: 'PRG-001', programNameAr: 'رشاقة', programNameEn: 'Cutting', bundleId: 'BND-001', bundleNameAr: 'باقة كاملة', bundleNameEn: 'Full bundle', price26DaysKd: 182, restaurantSettlementCommissionPct: 22 },
  { restaurantId: 'RST-005', restaurantName: 'Protein House', programId: 'PRG-001', programNameAr: 'رشاقة', programNameEn: 'Cutting', bundleId: 'BND-001', bundleNameAr: 'باقة كاملة', bundleNameEn: 'Full bundle', price26DaysKd: 110, restaurantSettlementCommissionPct: 16 },
  { restaurantId: 'RST-006', restaurantName: 'Healthy Hub', programId: 'PRG-001', programNameAr: 'رشاقة', programNameEn: 'Cutting', bundleId: 'BND-001', bundleNameAr: 'باقة كاملة', bundleNameEn: 'Full bundle', price26DaysKd: 98, restaurantSettlementCommissionPct: 17 },
  // Cutting + Lunch
  { restaurantId: 'RST-001', restaurantName: 'مطبخ الصحة', programId: 'PRG-001', programNameAr: 'رشاقة', programNameEn: 'Cutting', bundleId: 'BND-002', bundleNameAr: 'باقة الغداء', bundleNameEn: 'Lunch bundle', price26DaysKd: 78, restaurantSettlementCommissionPct: 15 },
  { restaurantId: 'RST-003', restaurantName: 'Fit Meals Co.', programId: 'PRG-001', programNameAr: 'رشاقة', programNameEn: 'Cutting', bundleId: 'BND-002', bundleNameAr: 'باقة الغداء', bundleNameEn: 'Lunch bundle', price26DaysKd: 91, restaurantSettlementCommissionPct: 20 },
  { restaurantId: 'RST-007', restaurantName: 'NutriBox KW', programId: 'PRG-001', programNameAr: 'رشاقة', programNameEn: 'Cutting', bundleId: 'BND-002', bundleNameAr: 'باقة الغداء', bundleNameEn: 'Lunch bundle', price26DaysKd: 85, restaurantSettlementCommissionPct: 19 },
  // Bulking + Full
  { restaurantId: 'RST-002', restaurantName: 'Green Kitchen', programId: 'PRG-002', programNameAr: 'ضخامة', programNameEn: 'Bulking', bundleId: 'BND-001', bundleNameAr: 'باقة كاملة', bundleNameEn: 'Full bundle', price26DaysKd: 143, restaurantSettlementCommissionPct: 18 },
  { restaurantId: 'RST-005', restaurantName: 'Protein House', programId: 'PRG-002', programNameAr: 'ضخامة', programNameEn: 'Bulking', bundleId: 'BND-001', bundleNameAr: 'باقة كاملة', bundleNameEn: 'Full bundle', price26DaysKd: 156, restaurantSettlementCommissionPct: 16 },
  { restaurantId: 'RST-008', restaurantName: 'Fresh Plate', programId: 'PRG-002', programNameAr: 'ضخامة', programNameEn: 'Bulking', bundleId: 'BND-001', bundleNameAr: 'باقة كاملة', bundleNameEn: 'Full bundle', price26DaysKd: 149, restaurantSettlementCommissionPct: 21 },
  // Keto + Lunch — single restaurant group
  { restaurantId: 'RST-003', restaurantName: 'Fit Meals Co.', programId: 'PRG-004', programNameAr: 'كيتو', programNameEn: 'Keto', bundleId: 'BND-002', bundleNameAr: 'باقة الغداء', bundleNameEn: 'Lunch bundle', price26DaysKd: 130, restaurantSettlementCommissionPct: 20 },
  // Maintain + Full
  { restaurantId: 'RST-001', restaurantName: 'مطبخ الصحة', programId: 'PRG-003', programNameAr: 'محافظة', programNameEn: 'Maintain', bundleId: 'BND-001', bundleNameAr: 'باقة كاملة', bundleNameEn: 'Full bundle', price26DaysKd: 120, restaurantSettlementCommissionPct: 15 },
  { restaurantId: 'RST-006', restaurantName: 'Healthy Hub', programId: 'PRG-003', programNameAr: 'محافظة', programNameEn: 'Maintain', bundleId: 'BND-001', bundleNameAr: 'باقة كاملة', bundleNameEn: 'Full bundle', price26DaysKd: 125, restaurantSettlementCommissionPct: 17 },
  { restaurantId: 'RST-007', restaurantName: 'NutriBox KW', programId: 'PRG-003', programNameAr: 'محافظة', programNameEn: 'Maintain', bundleId: 'BND-001', bundleNameAr: 'باقة كاملة', bundleNameEn: 'Full bundle', price26DaysKd: 118, restaurantSettlementCommissionPct: 19 },
];

export const OUTLIER_AUDIT_MOCK: OutlierAuditLog[] = [];

export const RECALCULATION_EVENTS_MOCK: RecalculationEvent[] = [
  {
    id: 'RC-001',
    type: 'price_change',
    summaryAr: 'Lean Bites رفع سعر رشاقة/كاملة إلى 182 د.ك — إعادة تصنيف المجموعة',
    summaryEn: 'Lean Bites raised Cutting/Full to 182 KD — group reclassified',
    at: '2025-06-20T08:05:00+03:00',
  },
  {
    id: 'RC-002',
    type: 'restaurant_join',
    summaryAr: 'انضم Fresh Plate لبرنامج ضخامة — تحديث متوسط Platinum',
    summaryEn: 'Fresh Plate joined Bulking — Platinum average updated',
    at: '2025-06-12T13:00:00+03:00',
  },
  {
    id: 'RC-003',
    type: 'bounds_change',
    summaryAr: 'تعديل حد Elite لمطعم واحد: 6.0 د.ك/يوم',
    summaryEn: 'Single-restaurant Elite bound updated to 6.0 KD/day',
    at: '2025-06-10T09:00:00+03:00',
  },
];

export const SUBSCRIPTION_STATS_MOCK = {
  activeSubscriptions: 1868,
  frozenSubscriptions: 3,
  customDurationCount: 118,
  expiringIn7Days: 52,
  checkoutInProgress: 14,
};
