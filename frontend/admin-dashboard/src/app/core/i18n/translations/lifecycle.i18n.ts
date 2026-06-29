export type LifecycleLocale = 'ar' | 'en';

export interface LifecycleCopy {
  searchPlaceholder: string;
  all: string;
  active: string;
  frozen: string;
  dispute: string;
  pendingDetach: string;
  expiring: string;
  cancelled: string;
  viewDetails: string;
  openCustomer: string;
  openManager: string;
  noResults: string;
  colFamily: string;
  colManager: string;
  colCustomer: string;
  colSubscription: string;
  colProgramBundle: string;
  colTier: string;
  colMembers: string;
  colDays: string;
  colActiveOrders: string;
  colStatus: string;
  colArea: string;
  colStartDate: string;
  colActions: string;
  kpiFamilyGroups: string;
  kpiFamilyMembers: string;
  kpiFamilyDisputes: string;
  kpiPendingDetach: string;
  kpiIndividualActive: string;
  kpiIndividualFrozen: string;
  kpiIndividualExpiring: string;
  kpiIndividualCancelled: string;
  familyMembersTitle: string;
  memberRole: string;
  memberQuota: string;
  memberUsed: string;
  memberOrders: string;
  escalationNote: string;
  close: string;
  daysUsedOf: string;
  expiringInDays: string;
  paginationFamilyGroups: string;
  paginationIndividualSubs: string;
  paginationFreezeRequests: string;
  kpiCurrentlyFrozen: string;
  kpiPendingStart: string;
  kpiEndingSoon: string;
  kpiRequestsThisMonth: string;
  policyTitle: string;
  policyDefaultDuration: string;
  policyStartDelay: string;
  policyExtendEnd: string;
  policyExtendEndDesc: string;
  policyStartDelayDesc: string;
  policyUpdatedBy: string;
  policySave: string;
  policySaved: string;
  filterPendingStart: string;
  filterEndingSoon: string;
  filterCompleted: string;
  colRequestedAt: string;
  colFreezeStart: string;
  colFreezeEnd: string;
  colDuration: string;
  colDaysAdded: string;
  colSubType: string;
  colRemainingDays: string;
  endFreezeEarly: string;
  endFreezeConfirm: string;
  conflictNote: string;
  freezeDetailTitle: string;
  days: string;
  enabled: string;
  paginationRenewals: string;
  kpiExpiringThisWeek: string;
  kpiRemindersSent: string;
  kpiRenewalInProgress: string;
  kpiRenewedThisMonth: string;
  kpiAtRisk: string;
  renewalPolicyTitle: string;
  renewalPolicyFirst: string;
  renewalPolicySecond: string;
  renewalPolicyFinal: string;
  renewalPolicySnapshot: string;
  renewalPolicySnapshotDesc: string;
  renewalPolicySaved: string;
  filterReminderSent: string;
  filterInProgress: string;
  filterRenewed: string;
  filterLapsed: string;
  filterAtRisk: string;
  colEndDate: string;
  colDaysRemaining: string;
  colReminderStage: string;
  colLastReminder: string;
  colPreviousPrice: string;
  colRenewalPrice: string;
  colWallet: string;
  colPromo: string;
  renewalDetailTitle: string;
  sendReminder: string;
  reminderSent: string;
  priceChangedNote: string;
  priceUnchangedNote: string;
  renewedAt: string;
  kd: string;
  paginationUpgrades: string;
  kpiUpgradePending: string;
  kpiUpgradeInProgress: string;
  kpiUpgradeNeedsReview: string;
  kpiUpgradeCompleted: string;
  kpiUpgradeRevenue: string;
  upgradePolicyTitle: string;
  upgradePolicyProrate: string;
  upgradePolicyProrateDesc: string;
  upgradePolicyEliteReview: string;
  upgradePolicyEliteReviewDesc: string;
  upgradePolicySnapshotDesc2: string;
  upgradePolicySaved: string;
  upgradeAllowedPaths: string;
  filterNeedsReview: string;
  filterRejected: string;
  colCurrentTier: string;
  colTargetTier: string;
  colTierChange: string;
  colProratedDiff: string;
  colSource: string;
  colAccessGain: string;
  upgradeDetailTitle: string;
  approveUpgrade: string;
  rejectUpgrade: string;
  upgradeApproved: string;
  upgradeRejected: string;
  rejectReason: string;
  rejectConfirm: string;
  tierBasic: string;
  tierPlatinum: string;
  tierElite: string;
  snapshotSaved: string;
  snapshotMissing: string;
}

export const LIFECYCLE_I18N: Record<LifecycleLocale, LifecycleCopy> = {
  ar: {
    searchPlaceholder: 'بحث بالاسم أو رقم الاشتراك…',
    all: 'الكل',
    active: 'نشط',
    frozen: 'مجمد',
    dispute: 'نزاع',
    pendingDetach: 'فصل قيد المراجعة',
    expiring: 'ينتهي قريباً',
    cancelled: 'ملغى',
    viewDetails: 'عرض التفاصيل',
    openCustomer: 'فتح ملف العميل',
    openManager: 'فتح ملف المدير',
    noResults: 'لا توجد نتائج مطابقة',
    colFamily: 'المجموعة العائلية',
    colManager: 'مدير العائلة',
    colCustomer: 'العميل',
    colSubscription: 'الاشتراك',
    colProgramBundle: 'البرنامج / الباقة',
    colTier: 'التصنيف',
    colMembers: 'الأفراد',
    colDays: 'الأيام',
    colActiveOrders: 'طلبات نشطة',
    colStatus: 'الحالة',
    colArea: 'منطقة الخدمة',
    colStartDate: 'تاريخ البدء',
    colActions: 'إجراءات',
    kpiFamilyGroups: 'مجموعات عائلية',
    kpiFamilyMembers: 'أفراد مرتبطون',
    kpiFamilyDisputes: 'نزاعات مفتوحة',
    kpiPendingDetach: 'فصل قيد المراجعة',
    kpiIndividualActive: 'اشتراكات نشطة',
    kpiIndividualFrozen: 'مجمدة',
    kpiIndividualExpiring: 'تنتهي قريباً',
    kpiIndividualCancelled: 'ملغاة',
    familyMembersTitle: 'أفراد المجموعة',
    memberRole: 'الدور',
    memberQuota: 'الحصة',
    memberUsed: 'مستخدم',
    memberOrders: 'طلبات',
    escalationNote: 'ملاحظة التصعيد',
    close: 'إغلاق',
    daysUsedOf: 'من',
    expiringInDays: 'أيام متبقية',
    paginationFamilyGroups: 'مجموعة',
    paginationIndividualSubs: 'اشتراك',
    paginationFreezeRequests: 'طلب',
    kpiCurrentlyFrozen: 'مجمّدون حالياً',
    kpiPendingStart: 'بانتظار البدء',
    kpiEndingSoon: 'ينتهي قريباً',
    kpiRequestsThisMonth: 'طلبات هذا الشهر',
    policyTitle: 'سياسة التجميد',
    policyDefaultDuration: 'المدة الافتراضية (أيام)',
    policyStartDelay: 'بدء التجميد بعد',
    policyExtendEnd: 'تمديد نهاية الاشتراك',
    policyExtendEndDesc: 'الأيام المجمّدة تُضاف تلقائياً لنهاية الاشتراك',
    policyStartDelayDesc: 'يومان محجوزان للطلبات القادمة قبل بدء التجميد',
    policyUpdatedBy: 'آخر تحديث',
    policySave: 'حفظ السياسة',
    policySaved: 'تم حفظ سياسة التجميد',
    filterPendingStart: 'بانتظار البدء',
    filterEndingSoon: 'ينتهي قريباً',
    filterCompleted: 'منتهٍ',
    colRequestedAt: 'تاريخ الطلب',
    colFreezeStart: 'بدء التجميد',
    colFreezeEnd: 'انتهاء متوقع',
    colDuration: 'المدة',
    colDaysAdded: 'أيام مضافة',
    colSubType: 'نوع الاشتراك',
    colRemainingDays: 'أيام متبقية',
    endFreezeEarly: 'إنهاء التجميد مبكراً',
    endFreezeConfirm: 'تأكيد إنهاء التجميد وعودة العميل للاختيار اليومي؟',
    conflictNote: 'ملاحظة',
    freezeDetailTitle: 'تفاصيل التجميد',
    days: 'يوم',
    enabled: 'مفعّل',
    paginationRenewals: 'اشتراك',
    kpiExpiringThisWeek: 'ينتهي هذا الأسبوع',
    kpiRemindersSent: 'تذكيرات مُرسلة',
    kpiRenewalInProgress: 'تجديد قيد الإكمال',
    kpiRenewedThisMonth: 'تم تجديدها هذا الشهر',
    kpiAtRisk: 'معرّض للانقطاع',
    renewalPolicyTitle: 'سياسة التذكير بالتجديد',
    renewalPolicyFirst: 'التذكير الأول (أيام قبل الانتهاء)',
    renewalPolicySecond: 'التذكير الثاني',
    renewalPolicyFinal: 'التذكير النهائي',
    renewalPolicySnapshot: 'حفظ Snapshot للتسعير',
    renewalPolicySnapshotDesc: 'يُحفظ سعر التجديد وقت التأكيد — الأسعار الجديدة للاشتراكات الجديدة فقط',
    renewalPolicySaved: 'تم حفظ سياسة التذكير',
    filterReminderSent: 'تذكير مُرسل',
    filterInProgress: 'قيد الإكمال',
    filterRenewed: 'تم التجديد',
    filterLapsed: 'انتهى دون تجديد',
    filterAtRisk: 'معرّض للانقطاع',
    colEndDate: 'تاريخ الانتهاء',
    colDaysRemaining: 'أيام متبقية',
    colReminderStage: 'مرحلة التذكير',
    colLastReminder: 'آخر تذكير',
    colPreviousPrice: 'السعر السابق',
    colRenewalPrice: 'سعر التجديد',
    colWallet: 'رصيد المحفظة',
    colPromo: 'كود خصم',
    renewalDetailTitle: 'تفاصيل التجديد',
    sendReminder: 'إرسال تذكير',
    reminderSent: 'تم إرسال التذكير',
    priceChangedNote: 'السعر تغيّر وفق سياسة التسعير الحالية',
    priceUnchangedNote: 'نفس السعر — لا تغيير على الاشتراك النشط',
    renewedAt: 'تاريخ التجديد',
    kd: 'د.ك',
    paginationUpgrades: 'طلب',
    kpiUpgradePending: 'بانتظار الدفع',
    kpiUpgradeInProgress: 'قيد المعالجة',
    kpiUpgradeNeedsReview: 'يحتاج مراجعة',
    kpiUpgradeCompleted: 'تمت هذا الشهر',
    kpiUpgradeRevenue: 'إيراد الترقيات',
    upgradePolicyTitle: 'سياسة ترقية التصنيف',
    upgradePolicyProrate: 'تناسب الأيام المتبقية',
    upgradePolicyProrateDesc: 'فرق السعر يُحسب على الأيام المتبقية فقط',
    upgradePolicyEliteReview: 'مراجعة Elite',
    upgradePolicyEliteReviewDesc: 'ترقية إلى Elite تتطلب موافقة أدمن',
    upgradePolicySnapshotDesc2: 'يُحفظ Snapshot للتسعير وقت التأكيد',
    upgradePolicySaved: 'تم حفظ سياسة الترقية',
    upgradeAllowedPaths: 'المسارات المسموحة: أساسي → بلاتينيوم → إيليت',
    filterNeedsReview: 'يحتاج مراجعة',
    filterRejected: 'مرفوض',
    colCurrentTier: 'التصنيف الحالي',
    colTargetTier: 'التصنيف المطلوب',
    colTierChange: 'التغيير',
    colProratedDiff: 'فرق السعر',
    colSource: 'المصدر',
    colAccessGain: 'وصول المطاعم',
    upgradeDetailTitle: 'تفاصيل الترقية',
    approveUpgrade: 'اعتماد الترقية',
    rejectUpgrade: 'رفض الترقية',
    upgradeApproved: 'تم اعتماد الترقية',
    upgradeRejected: 'تم رفض الترقية',
    rejectReason: 'سبب الرفض',
    rejectConfirm: 'تأكيد رفض طلب الترقية؟',
    tierBasic: 'أساسي',
    tierPlatinum: 'بلاتينيوم',
    tierElite: 'إيليت',
    snapshotSaved: 'Snapshot محفوظ',
    snapshotMissing: 'Snapshot غير متوفر',
  },
  en: {
    searchPlaceholder: 'Search by name or subscription ID…',
    all: 'All',
    active: 'Active',
    frozen: 'Frozen',
    dispute: 'Dispute',
    pendingDetach: 'Pending detach',
    expiring: 'Expiring soon',
    cancelled: 'Cancelled',
    viewDetails: 'View details',
    openCustomer: 'Open customer profile',
    openManager: 'Open manager profile',
    noResults: 'No matching results',
    colFamily: 'Family group',
    colManager: 'Family manager',
    colCustomer: 'Customer',
    colSubscription: 'Subscription',
    colProgramBundle: 'Program / Bundle',
    colTier: 'Tier',
    colMembers: 'Members',
    colDays: 'Days',
    colActiveOrders: 'Active orders',
    colStatus: 'Status',
    colArea: 'Service area',
    colStartDate: 'Start date',
    colActions: 'Actions',
    kpiFamilyGroups: 'Family groups',
    kpiFamilyMembers: 'Linked members',
    kpiFamilyDisputes: 'Open disputes',
    kpiPendingDetach: 'Pending detach',
    kpiIndividualActive: 'Active subscriptions',
    kpiIndividualFrozen: 'Frozen',
    kpiIndividualExpiring: 'Expiring soon',
    kpiIndividualCancelled: 'Cancelled',
    familyMembersTitle: 'Group members',
    memberRole: 'Role',
    memberQuota: 'Quota',
    memberUsed: 'Used',
    memberOrders: 'Orders',
    escalationNote: 'Escalation note',
    close: 'Close',
    daysUsedOf: 'of',
    expiringInDays: 'days left',
    paginationFamilyGroups: 'groups',
    paginationIndividualSubs: 'subscriptions',
    paginationFreezeRequests: 'requests',
    kpiCurrentlyFrozen: 'Currently frozen',
    kpiPendingStart: 'Pending start',
    kpiEndingSoon: 'Ending soon',
    kpiRequestsThisMonth: 'Requests this month',
    policyTitle: 'Freeze policy',
    policyDefaultDuration: 'Default duration (days)',
    policyStartDelay: 'Freeze starts after',
    policyExtendEnd: 'Extend subscription end',
    policyExtendEndDesc: 'Frozen days are automatically added to subscription end',
    policyStartDelayDesc: 'Two days reserved for upcoming orders before freeze starts',
    policyUpdatedBy: 'Last updated by',
    policySave: 'Save policy',
    policySaved: 'Freeze policy saved',
    filterPendingStart: 'Pending start',
    filterEndingSoon: 'Ending soon',
    filterCompleted: 'Completed',
    colRequestedAt: 'Requested at',
    colFreezeStart: 'Freeze start',
    colFreezeEnd: 'Expected end',
    colDuration: 'Duration',
    colDaysAdded: 'Days added',
    colSubType: 'Subscription type',
    colRemainingDays: 'Remaining days',
    endFreezeEarly: 'End freeze early',
    endFreezeConfirm: 'Confirm ending freeze and returning customer to daily selection?',
    conflictNote: 'Note',
    freezeDetailTitle: 'Freeze details',
    days: 'days',
    enabled: 'Enabled',
    paginationRenewals: 'subscriptions',
    kpiExpiringThisWeek: 'Expiring this week',
    kpiRemindersSent: 'Reminders sent',
    kpiRenewalInProgress: 'Renewal in progress',
    kpiRenewedThisMonth: 'Renewed this month',
    kpiAtRisk: 'At risk',
    renewalPolicyTitle: 'Renewal reminder policy',
    renewalPolicyFirst: 'First reminder (days before end)',
    renewalPolicySecond: 'Second reminder',
    renewalPolicyFinal: 'Final reminder',
    renewalPolicySnapshot: 'Save pricing snapshot',
    renewalPolicySnapshotDesc: 'Renewal price is snapshotted at confirmation — new prices apply to new subscriptions only',
    renewalPolicySaved: 'Reminder policy saved',
    filterReminderSent: 'Reminder sent',
    filterInProgress: 'In progress',
    filterRenewed: 'Renewed',
    filterLapsed: 'Lapsed',
    filterAtRisk: 'At risk',
    colEndDate: 'End date',
    colDaysRemaining: 'Days remaining',
    colReminderStage: 'Reminder stage',
    colLastReminder: 'Last reminder',
    colPreviousPrice: 'Previous price',
    colRenewalPrice: 'Renewal price',
    colWallet: 'Wallet balance',
    colPromo: 'Promo code',
    renewalDetailTitle: 'Renewal details',
    sendReminder: 'Send reminder',
    reminderSent: 'Reminder sent',
    priceChangedNote: 'Price changed per current pricing policy',
    priceUnchangedNote: 'Same price — active subscription unchanged',
    renewedAt: 'Renewed at',
    kd: 'KD',
    paginationUpgrades: 'requests',
    kpiUpgradePending: 'Pending payment',
    kpiUpgradeInProgress: 'In progress',
    kpiUpgradeNeedsReview: 'Needs review',
    kpiUpgradeCompleted: 'Completed this month',
    kpiUpgradeRevenue: 'Upgrade revenue',
    upgradePolicyTitle: 'Tier upgrade policy',
    upgradePolicyProrate: 'Prorate remaining days',
    upgradePolicyProrateDesc: 'Price difference calculated on remaining days only',
    upgradePolicyEliteReview: 'Elite review',
    upgradePolicyEliteReviewDesc: 'Upgrades to Elite require admin approval',
    upgradePolicySnapshotDesc2: 'Pricing snapshot saved at confirmation',
    upgradePolicySaved: 'Upgrade policy saved',
    upgradeAllowedPaths: 'Allowed paths: Basic → Platinum → Elite',
    filterNeedsReview: 'Needs review',
    filterRejected: 'Rejected',
    colCurrentTier: 'Current tier',
    colTargetTier: 'Target tier',
    colTierChange: 'Change',
    colProratedDiff: 'Price difference',
    colSource: 'Source',
    colAccessGain: 'Restaurant access',
    upgradeDetailTitle: 'Upgrade details',
    approveUpgrade: 'Approve upgrade',
    rejectUpgrade: 'Reject upgrade',
    upgradeApproved: 'Upgrade approved',
    upgradeRejected: 'Upgrade rejected',
    rejectReason: 'Rejection reason',
    rejectConfirm: 'Confirm rejecting this upgrade request?',
    tierBasic: 'Basic',
    tierPlatinum: 'Platinum',
    tierElite: 'Elite',
    snapshotSaved: 'Snapshot saved',
    snapshotMissing: 'Snapshot missing',
  },
};
