export type SubscriptionsLocale = 'ar' | 'en';

export interface SubscriptionsCopy {
  searchPlaceholder: string;
  all: string;
  active: string;
  inactive: string;
  hiddenForNew: string;
  savePublish: string;
  saved: string;
  loading: string;
  empty: string;
  retry: string;
  yes: string;
  no: string;
  days: string;
  kd: string;
  pct: string;
  tabDurations: string;
  tabPrograms: string;
  tabBundles: string;
  colName: string;
  colDays: string;
  colStatus: string;
  colCommission: string;
  colProgram: string;
  colBundle: string;
  colRestaurantsPriced: string;
  colActiveSubs: string;
  colComponents: string;
  colCustom: string;
  colReadiness: string;
  colActions: string;
  readinessGate: string;
  readinessGateDesc: string;
  notSelectable: string;
  keptForExisting: string;
  newSubsOnly: string;
  kpiActivePrograms: string;
  kpiBundles: string;
  kpiAwaitingPricing: string;
  kpiActiveSubscriptions: string;
  kpiFrozen: string;
  kpiCustomDuration: string;
  componentBreakfast: string;
  componentMain: string;
  componentSnack: string;
  componentSalad: string;
  ready: string;
  notReady: string;
  programDetail: string;
  description: string;
  tierBasic: string;
  tierPlatinum: string;
  tierElite: string;
  kpiBasicShare: string;
  kpiPlatinumShare: string;
  kpiEliteShare: string;
  kpiFlagged: string;
  kpiNeedsRecalc: string;
  filterProgram: string;
  filterBundle: string;
  filterTier: string;
  filterFlaggedOnly: string;
  singleRestaurantBounds: string;
  singleRestaurantBoundsDesc: string;
  basicMaxDaily: string;
  eliteMinDaily: string;
  colRestaurant: string;
  colPrice26: string;
  colDailyBox: string;
  colMean: string;
  colStdDev: string;
  colTier: string;
  colOutlier: string;
  colExpectedProfit: string;
  accessRuleTitle: string;
  accessRuleDesc: string;
  pricingRuleTitle: string;
  pricingRuleDesc: string;
  outlierAction: string;
  outlierKeep: string;
  outlierMoveHigher: string;
  outlierExclude: string;
  reasonRequired: string;
  confirmAction: string;
  cancel: string;
  kpiMaxCommission: string;
  kpiMinCommission: string;
  kpiProfitAlerts: string;
  kpiCheckoutSubs: string;
  platformCommissionTitle: string;
  platformCommissionDesc: string;
  maxCommission: string;
  minCommission: string;
  commissionModeGlobal: string;
  commissionModePerBundle: string;
  commissionModeGlobalDesc: string;
  commissionModePerBundleDesc: string;
  commissionPreviewTitle: string;
  commissionInterpolationNote: string;
  commissionAtDay: string;
  commissionShortDuration: string;
  commissionLongDuration: string;
  bundleCommissionCard: string;
  usesGlobalBounds: string;
  customBundleBounds: string;
  kpiCommissionMode: string;
  unsavedChanges: string;
  editCommissionBounds: string;
  profitAlertsClear: string;
  profitAlertsDanger: string;
  profitAlertsWarning: string;
  restaurantCommissionTitle: string;
  restaurantCommissionDesc: string;
  settlementCommission: string;
  tierAveragesTitle: string;
  tierAveragesDesc: string;
  colAvg26: string;
  colAvgDaily: string;
  colRestaurantCount: string;
  colCustomer6: string;
  colCustomer12: string;
  colCustomer26: string;
  profitabilityAlerts: string;
  recalculationMonitor: string;
  noRetroactiveBanner: string;
  platformVsSettlement: string;
  updatedAt: string;
  viewRestaurant: string;
  addNew: string;
  edit: string;
  delete: string;
  deleteConfirmTitle: string;
  deleteConfirmDesc: string;
  hideInsteadMsg: string;
  deletedMsg: string;
  cannotDeletePreset: string;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  createdAt: string;
  linkedRestaurants: string;
  bundlePricingStatus: string;
  priced: string;
  notPriced: string;
  programBundlesTitle: string;
  bundleProgramsTitle: string;
  mainMealsCount: string;
  customDurationLabel: string;
  save: string;
  addProgram: string;
  addBundle: string;
  addDuration: string;
  country: string;
  noRestaurantsYet: string;
  editDuration: string;
  editProgram: string;
  editBundle: string;
  viewDetails: string;
  systemPreset: string;
}

export const SUBSCRIPTIONS_I18N: Record<SubscriptionsLocale, SubscriptionsCopy> = {
  ar: {
    searchPlaceholder: 'ابحث بالاسم أو المعرف...',
    all: 'الكل',
    active: 'نشط',
    inactive: 'معطّل',
    hiddenForNew: 'مخفي للجدد',
    savePublish: 'حفظ ونشر',
    saved: 'تم الحفظ — التغييرات للاشتراكات الجديدة فقط',
    loading: 'جاري التحميل...',
    empty: 'لا توجد نتائج',
    retry: 'إعادة المحاولة',
    yes: 'نعم',
    no: 'لا',
    days: 'يوم',
    kd: 'د.ك',
    pct: '%',
    tabDurations: 'المدد',
    tabPrograms: 'البرامج',
    tabBundles: 'الباقات',
    colName: 'الاسم',
    colDays: 'الأيام',
    colStatus: 'الحالة',
    colCommission: 'عمولة مرتبطة',
    colProgram: 'البرنامج',
    colBundle: 'الباقة',
    colRestaurantsPriced: 'مطاعم مسعّرة',
    colActiveSubs: 'اشتراكات نشطة',
    colComponents: 'المكوّنات',
    colCustom: 'مخصصة',
    colReadiness: 'الجاهزية',
    colActions: 'إجراءات',
    readinessGate: 'بوابة الجاهزية',
    readinessGateDesc: 'برامج/باقات بلا أسعار مطاعم لـ26 يوم غير قابلة للاختيار',
    notSelectable: 'غير متاح للاختيار',
    keptForExisting: 'محفوظ للحاليين',
    newSubsOnly: 'للاشتراكات الجديدة فقط',
    kpiActivePrograms: 'برامج نشطة',
    kpiBundles: 'باقات',
    kpiAwaitingPricing: 'بانتظار تسعير',
    kpiActiveSubscriptions: 'اشتراكات نشطة',
    kpiFrozen: 'مجمّدة',
    kpiCustomDuration: 'مدة مخصصة',
    componentBreakfast: 'إفطار',
    componentMain: 'رئيسية',
    componentSnack: 'سناك',
    componentSalad: 'سلطة',
    ready: 'جاهز',
    notReady: 'غير جاهز',
    programDetail: 'تفاصيل البرنامج',
    description: 'الوصف',
    tierBasic: 'Basic',
    tierPlatinum: 'Platinum',
    tierElite: 'Elite',
    kpiBasicShare: 'نسبة Basic',
    kpiPlatinumShare: 'نسبة Platinum',
    kpiEliteShare: 'نسبة Elite',
    kpiFlagged: 'يحتاج مراجعة',
    kpiNeedsRecalc: 'إعادة حساب',
    filterProgram: 'البرنامج',
    filterBundle: 'الباقة',
    filterTier: 'التصنيف',
    filterFlaggedOnly: 'المُعلّم فقط',
    singleRestaurantBounds: 'حدود مطعم واحد',
    singleRestaurantBoundsDesc: 'تُستخدم عند وجود مطعم واحد في المجموعة',
    basicMaxDaily: 'حد Basic (أقل من)',
    eliteMinDaily: 'حد Elite (من)',
    colRestaurant: 'المطعم',
    colPrice26: 'سعر 26 يوم',
    colDailyBox: 'بوكس يومي',
    colMean: 'متوسط السعر اليومي',
    colStdDev: 'مدى تفاوت الأسعار',
    colTier: 'التصنيف',
    colOutlier: 'علامة',
    colExpectedProfit: 'ربح متوقع/يوم',
    accessRuleTitle: 'وصول العميل (هرمي)',
    accessRuleDesc: 'Basic يرى Basic فقط · Platinum يرى Basic+Platinum · Elite يرى الكل — للتقويم فقط',
    pricingRuleTitle: 'متوسط التسعير (غير تراكمي)',
    pricingRuleDesc: 'كل تصنيف يُسعّر من مطاعم نفس التصنيف فقط — Platinum لا يشمل Basic',
    outlierAction: 'إجراء المراجعة',
    outlierKeep: 'الإبقاء على المطعم',
    outlierMoveHigher: 'نقل لتصنيف أعلى',
    outlierExclude: 'استبعاد المطعم',
    reasonRequired: 'السبب (إلزامي)',
    confirmAction: 'تأكيد',
    cancel: 'إلغاء',
    kpiMaxCommission: 'عمولة قصوى',
    kpiMinCommission: 'عمولة دنيا',
    kpiProfitAlerts: 'تنبيهات ربح',
    kpiCheckoutSubs: 'في الدفع',
    platformCommissionTitle: 'حدود عمولة المنصة',
    platformCommissionDesc: 'اضبط أعلى وأقل نسبة عمولة — النظام يطبّقها تلقائياً حسب مدة الاشتراك',
    maxCommission: 'أعلى نسبة عمولة',
    minCommission: 'أقل نسبة عمولة',
    commissionModeGlobal: 'حدود موحّدة',
    commissionModePerBundle: 'تخصيص لكل باقة',
    commissionModeGlobalDesc: 'نفس الحدود لكل البرامج والباقات حسب مدة الاشتراك.',
    commissionModePerBundleDesc: 'حد أعلى وأدنى مختلف لكل باقة عند تسعير العميل.',
    commissionPreviewTitle: 'معاينة حسب المدة',
    commissionInterpolationNote: 'الاشتراك القصير أعلى عمولة — الطويل أقل عمولة',
    commissionAtDay: 'يوم',
    commissionShortDuration: 'قصيرة',
    commissionLongDuration: 'طويلة',
    bundleCommissionCard: 'حدود الباقة',
    usesGlobalBounds: 'تستخدم الحدود الموحّدة',
    customBundleBounds: 'حدود مخصّصة',
    kpiCommissionMode: 'وضع العمولة',
    unsavedChanges: 'تغييرات غير محفوظة',
    editCommissionBounds: 'تعديل حدود العمولة',
    profitAlertsClear: 'لا توجد تنبيهات ربحية',
    profitAlertsDanger: 'حرج',
    profitAlertsWarning: 'تحذير',
    restaurantCommissionTitle: 'عمولة تسوية المطاعم',
    restaurantCommissionDesc: 'تُخصم من سعر البوكس المتفق عليه — ليست من سعر العميل',
    settlementCommission: 'عمولة التسوية',
    tierAveragesTitle: 'متوسطات القروب',
    tierAveragesDesc: 'محسوبة تلقائياً لكل برنامج وباقة وتصنيف',
    colAvg26: 'متوسط 26 يوم',
    colAvgDaily: 'متوسط يومي',
    colRestaurantCount: 'عدد المطاعم',
    colCustomer6: 'سعر عميل 6 أيام',
    colCustomer12: 'سعر عميل 12 يوم',
    colCustomer26: 'سعر عميل 26 يوم',
    profitabilityAlerts: 'تنبيهات الربحية',
    recalculationMonitor: 'مراقب إعادة الحساب',
    noRetroactiveBanner: 'الاشتراكات النشطة لا تُعاد تسعيرها بأثر رجعي',
    platformVsSettlement: 'عمولة MealMate (على العميل) ≠ عمولة تسوية المطعم — تُدار من ملف كل مطعم في المحفظة والمالية',
    updatedAt: 'آخر تحديث',
    viewRestaurant: 'ملف المطعم',
    addNew: 'إضافة',
    edit: 'تعديل',
    delete: 'حذف',
    deleteConfirmTitle: 'تأكيد الحذف',
    deleteConfirmDesc: 'هل أنت متأكد؟ الاشتراكات النشطة ستُحفظ للمشتركين الحاليين.',
    hideInsteadMsg: 'تم إخفاؤه عن الجدد — محفوظ للمشتركين الحاليين',
    deletedMsg: 'تم الحذف بنجاح',
    cannotDeletePreset: 'لا يمكن حذف المدة الأساسية — يمكنك تعطيلها فقط',
    nameAr: 'الاسم (عربي)',
    nameEn: 'الاسم (إنجليزي)',
    descAr: 'الوصف (عربي)',
    descEn: 'الوصف (إنجليزي)',
    createdAt: 'تاريخ الإنشاء',
    linkedRestaurants: 'المطاعم المسعّرة',
    bundlePricingStatus: 'حالة تسعير الباقات',
    priced: 'مسعّر',
    notPriced: 'بانتظار التسعير',
    programBundlesTitle: 'الباقات المرتبطة',
    bundleProgramsTitle: 'البرامج المرتبطة',
    mainMealsCount: 'عدد الوجبات الرئيسية',
    customDurationLabel: 'مدة مخصصة',
    save: 'حفظ',
    addProgram: 'برنامج جديد',
    addBundle: 'باقة جديدة',
    addDuration: 'مدة جديدة',
    country: 'الدولة',
    noRestaurantsYet: 'لا مطاعم مسعّرة بعد',
    editDuration: 'تعديل المدة',
    editProgram: 'تعديل البرنامج',
    editBundle: 'تعديل الباقة',
    viewDetails: 'عرض التفاصيل',
    systemPreset: 'مدة نظام',
  },
  en: {
    searchPlaceholder: 'Search by name or ID...',
    all: 'All',
    active: 'Active',
    inactive: 'Inactive',
    hiddenForNew: 'Hidden for new',
    savePublish: 'Save & publish',
    saved: 'Saved — changes apply to new subscriptions only',
    loading: 'Loading...',
    empty: 'No results',
    retry: 'Retry',
    yes: 'Yes',
    no: 'No',
    days: 'days',
    kd: 'KD',
    pct: '%',
    tabDurations: 'Durations',
    tabPrograms: 'Programs',
    tabBundles: 'Bundles',
    colName: 'Name',
    colDays: 'Days',
    colStatus: 'Status',
    colCommission: 'Linked commission',
    colProgram: 'Program',
    colBundle: 'Bundle',
    colRestaurantsPriced: 'Priced restaurants',
    colActiveSubs: 'Active subs',
    colComponents: 'Components',
    colCustom: 'Custom',
    colReadiness: 'Readiness',
    colActions: 'Actions',
    readinessGate: 'Readiness gate',
    readinessGateDesc: 'Programs/bundles without restaurant 26-day prices are not selectable',
    notSelectable: 'Not selectable',
    keptForExisting: 'Kept for existing',
    newSubsOnly: 'New subscriptions only',
    kpiActivePrograms: 'Active programs',
    kpiBundles: 'Bundles',
    kpiAwaitingPricing: 'Awaiting pricing',
    kpiActiveSubscriptions: 'Active subscriptions',
    kpiFrozen: 'Frozen',
    kpiCustomDuration: 'Custom duration',
    componentBreakfast: 'Breakfast',
    componentMain: 'Main',
    componentSnack: 'Snack',
    componentSalad: 'Salad',
    ready: 'Ready',
    notReady: 'Not ready',
    programDetail: 'Program details',
    description: 'Description',
    tierBasic: 'Basic',
    tierPlatinum: 'Platinum',
    tierElite: 'Elite',
    kpiBasicShare: 'Basic share',
    kpiPlatinumShare: 'Platinum share',
    kpiEliteShare: 'Elite share',
    kpiFlagged: 'Flagged',
    kpiNeedsRecalc: 'Recalc needed',
    filterProgram: 'Program',
    filterBundle: 'Bundle',
    filterTier: 'Tier',
    filterFlaggedOnly: 'Flagged only',
    singleRestaurantBounds: 'Single-restaurant bounds',
    singleRestaurantBoundsDesc: 'Used when only one restaurant exists in the group',
    basicMaxDaily: 'Basic max (less than)',
    eliteMinDaily: 'Elite min (from)',
    colRestaurant: 'Restaurant',
    colPrice26: '26-day price',
    colDailyBox: 'Daily box',
    colMean: 'Avg daily price',
    colStdDev: 'Price spread',
    colTier: 'Tier',
    colOutlier: 'Flag',
    colExpectedProfit: 'Expected profit/day',
    accessRuleTitle: 'Customer access (hierarchical)',
    accessRuleDesc: 'Basic sees Basic only · Platinum sees Basic+Platinum · Elite sees all — calendar only',
    pricingRuleTitle: 'Pricing average (non-cumulative)',
    pricingRuleDesc: 'Each tier priced from same-tier restaurants only — Platinum excludes Basic',
    outlierAction: 'Review action',
    outlierKeep: 'Keep restaurant',
    outlierMoveHigher: 'Move to higher tier',
    outlierExclude: 'Exclude restaurant',
    reasonRequired: 'Reason (required)',
    confirmAction: 'Confirm',
    cancel: 'Cancel',
    kpiMaxCommission: 'Max commission',
    kpiMinCommission: 'Min commission',
    kpiProfitAlerts: 'Profit alerts',
    kpiCheckoutSubs: 'In checkout',
    platformCommissionTitle: 'Platform commission bounds',
    platformCommissionDesc: 'Set the highest and lowest commission rates — applied automatically by subscription length',
    maxCommission: 'Highest commission rate',
    minCommission: 'Lowest commission rate',
    commissionModeGlobal: 'Global bounds',
    commissionModePerBundle: 'Per bundle',
    commissionModeGlobalDesc: 'Same bounds for all programs and bundles, based on subscription length.',
    commissionModePerBundleDesc: 'Different max/min per bundle when pricing for customers.',
    commissionPreviewTitle: 'Preview by duration',
    commissionInterpolationNote: 'Shorter subscriptions use a higher rate — longer ones use a lower rate',
    commissionAtDay: 'Day',
    commissionShortDuration: 'Short',
    commissionLongDuration: 'Long',
    bundleCommissionCard: 'Bundle bounds',
    usesGlobalBounds: 'Uses global bounds',
    customBundleBounds: 'Custom bounds',
    kpiCommissionMode: 'Commission mode',
    unsavedChanges: 'Unsaved changes',
    editCommissionBounds: 'Edit commission bounds',
    profitAlertsClear: 'No profitability alerts',
    profitAlertsDanger: 'critical',
    profitAlertsWarning: 'warning',
    restaurantCommissionTitle: 'Restaurant settlement commission',
    restaurantCommissionDesc: 'Deducted from agreed box price — not from customer price',
    settlementCommission: 'Settlement %',
    tierAveragesTitle: 'Tier group averages',
    tierAveragesDesc: 'Calculated automatically per program, bundle, and tier',
    colAvg26: 'Avg 26-day',
    colAvgDaily: 'Avg daily',
    colRestaurantCount: 'Restaurants',
    colCustomer6: 'Customer 6-day',
    colCustomer12: 'Customer 12-day',
    colCustomer26: 'Customer 26-day',
    profitabilityAlerts: 'Profitability alerts',
    recalculationMonitor: 'Recalculation monitor',
    noRetroactiveBanner: 'Active subscriptions are never repriced retroactively',
    platformVsSettlement: 'MealMate commission (on customer) ≠ restaurant settlement commission — managed per restaurant in Wallet & Finance',
    updatedAt: 'Updated',
    viewRestaurant: 'Restaurant account',
    addNew: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    deleteConfirmTitle: 'Confirm delete',
    deleteConfirmDesc: 'Are you sure? Active subscribers will keep their current plan.',
    hideInsteadMsg: 'Hidden for new subscribers — kept for existing',
    deletedMsg: 'Deleted successfully',
    cannotDeletePreset: 'Cannot delete system duration — deactivate instead',
    nameAr: 'Name (Arabic)',
    nameEn: 'Name (English)',
    descAr: 'Description (Arabic)',
    descEn: 'Description (English)',
    createdAt: 'Created',
    linkedRestaurants: 'Priced restaurants',
    bundlePricingStatus: 'Bundle pricing status',
    priced: 'Priced',
    notPriced: 'Awaiting pricing',
    programBundlesTitle: 'Linked bundles',
    bundleProgramsTitle: 'Linked programs',
    mainMealsCount: 'Main meals count',
    customDurationLabel: 'Custom duration',
    save: 'Save',
    addProgram: 'New program',
    addBundle: 'New bundle',
    addDuration: 'New duration',
    country: 'Country',
    noRestaurantsYet: 'No priced restaurants yet',
    editDuration: 'Edit duration',
    editProgram: 'Edit program',
    editBundle: 'Edit bundle',
    viewDetails: 'View details',
    systemPreset: 'System preset',
  },
};

export const TIER_LABELS: Record<SubscriptionsLocale, Record<string, string>> = {
  ar: { basic: 'Basic', platinum: 'Platinum', elite: 'Elite' },
  en: { basic: 'Basic', platinum: 'Platinum', elite: 'Elite' },
};
