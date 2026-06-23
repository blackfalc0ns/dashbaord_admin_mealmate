export type OperationsLocale = 'ar' | 'en';

export interface OperationsCopy {
  searchPlaceholder: string;
  all: string;
  needsAction: string;
  needsActionDesc: string;
  awaitingConfirm: string;
  awaitingConfirmDesc: string;
  replacement: string;
  replacementDesc: string;
  prep24: string;
  prep24Desc: string;
  todayOrders: string;
  todayOrdersDesc: string;
  customer: string;
  restaurant: string;
  deliveryDate: string;
  hoursLeft: string;
  phase: string;
  sla: string;
  actions: string;
  actionMenu: string;
  noOrders: string;
  noOrdersNeedsAction: string;
  openReplacement: string;
  manualReassign: string;
  applyException: string;
  viewDetails: string;
  orderId: string;
  meal: string;
  program: string;
  bundle: string;
  tier: string;
  yes: string;
  no: string;
  none: string;
  unassigned: string;
  barcode: string;
  invoice: string;
  driver: string;
  confirmAction: string;
  cancel: string;
  reason: string;
  exceptionType: string;
  submitException: string;
  changeBox: string;
  changeRestaurant: string;
  cancelDay: string;
  actor: string;
  appliedAt: string;
  auditLog: string;
  auditLogDesc: string;
  tabOverview: string;
  tabTimeline: string;
  tabRestaurant: string;
  tabPrep: string;
  tabDelivery: string;
  tabExceptions: string;
  customerEditLocked: string;
  customerEditOpen: string;
  confirmDeadline: string;
  trackingTab: string;
  holdTab: string;
  activeDeliveries: string;
  activeDesc: string;
  holdActive: string;
  holdActiveDesc: string;
  area: string;
  status: string;
  eta: string;
  distance: string;
  pickupScan: string;
  deliveryScan: string;
  noTracking: string;
  holdReason: string;
  holdStarted: string;
  contactAttempts: string;
  resolve: string;
  logContact: string;
  noHoldCases: string;
  minutes: string;
  km: string;
  inTransit: string;
  arriving: string;
  delivered: string;
  awaitingPickup: string;
  orderNotFound: string;
  backToOrders: string;
  subscriptionId: string;
  subscriptionDay: string;
  customerPhone: string;
  deliveryArea: string;
  deliveryAddress: string;
  restaurantPhone: string;
  restaurantContact: string;
  lockedAt: string;
  sentToRestaurantAt: string;
  allergens: string;
  dietaryNotes: string;
  escalationNotes: string;
  restaurantContactAttempts: string;
  alternativeRestaurants: string;
  mealCalories: string;
  autoSelected: string;
  autoSelectedYes: string;
  autoSelectedNo: string;
  confirmationStatus: string;
  confirmStatusPending: string;
  confirmStatusOverdue: string;
  confirmStatusConfirmed: string;
  confirmStatusReassigned: string;
  overdueAlertTitle: string;
  overdueAlertBody: string;
  viewRestaurantAccount: string;
  panelOrderMeal: string;
  panelCustomerDelivery: string;
  panelSubscription: string;
  panelRestaurantContact: string;
  panelConfirmationSla: string;
  panelEscalation: string;
  panelTimeline: string;
  panelOperations: string;
  panelRestaurantSla: string;
  opsNotStarted: string;
  noExceptionsYet: string;
  dayOfTotal: string;
  kcal: string;
}

export const OPERATIONS_I18N: Record<OperationsLocale, OperationsCopy> = {
  ar: {
    searchPlaceholder: 'ابحث برقم الطلب، العميل، أو المطعم...',
    all: 'الكل',
    needsAction: 'يحتاج تدخل',
    needsActionDesc: 'تأخر تأكيد، بديل ينتهي، أو نقص تحضير',
    awaitingConfirm: 'بانتظار التأكيد',
    awaitingConfirmDesc: 'داخل نافذة 24 ساعة',
    replacement: 'نوافذ البديل',
    replacementDesc: '24h لاختيار مطعم بديل',
    prep24: 'تحضير 24h',
    prep24Desc: 'باركود، فاتورة، وسائق',
    todayOrders: 'طلبات اليوم',
    todayOrdersDesc: 'جميع الطلبات النشطة',
    customer: 'العميل',
    restaurant: 'المطعم',
    deliveryDate: 'تاريخ التوصيل',
    hoursLeft: 'متبقي',
    phase: 'المرحلة',
    sla: 'SLA',
    actions: 'إجراءات',
    actionMenu: 'إجراء',
    noOrders: 'لا توجد طلبات مطابقة',
    noOrdersNeedsAction: 'لا طلبات تحتاج تدخل اليوم',
    openReplacement: 'فتح نافذة بديل',
    manualReassign: 'تعيين مطعم',
    applyException: 'تطبيق استثناء',
    viewDetails: 'عرض التفاصيل',
    orderId: 'رقم الطلب',
    meal: 'الوجبة',
    program: 'البرنامج',
    bundle: 'الباقة',
    tier: 'المستوى',
    yes: 'نعم',
    no: 'لا',
    none: '—',
    unassigned: 'غير معيّن',
    barcode: 'الباركود',
    invoice: 'الفاتورة',
    driver: 'السائق',
    confirmAction: 'تأكيد الإجراء',
    cancel: 'إلغاء',
    reason: 'السبب (إلزامي)',
    exceptionType: 'نوع الاستثناء',
    submitException: 'تطبيق الاستثناء',
    changeBox: 'تغيير الوجبة',
    changeRestaurant: 'تغيير المطعم',
    cancelDay: 'إلغاء يوم',
    actor: 'المُنفّذ',
    appliedAt: 'وقت التطبيق',
    auditLog: 'سجل الاستثناءات',
    auditLogDesc: 'سجل تدقيق للإجراءات داخل نافذة 72h',
    tabOverview: 'نظرة عامة',
    tabTimeline: 'الجدول الزمني',
    tabRestaurant: 'المطعم',
    tabPrep: 'التحضير والملصقات',
    tabDelivery: 'التوصيل',
    tabExceptions: 'الاستثناءات',
    customerEditLocked: 'تعديل العميل مقفل',
    customerEditOpen: 'العميل يمكنه التعديل',
    confirmDeadline: 'مهلة التأكيد',
    trackingTab: 'تتبع مباشر',
    holdTab: 'حالات Hold',
    activeDeliveries: 'توصيلات جارية',
    activeDesc: 'في الطريق أو قريبة من العميل',
    holdActive: 'Hold نشطة',
    holdActiveDesc: 'تحتاج متابعة وتواصل',
    area: 'المنطقة',
    status: 'الحالة',
    eta: 'الوقت المتوقع',
    distance: 'المسافة',
    pickupScan: 'استلام',
    deliveryScan: 'تسليم',
    noTracking: 'لا توجد توصيلات نشطة',
    holdReason: 'سبب التوقف',
    holdStarted: 'بدأت',
    contactAttempts: 'محاولات التواصل',
    resolve: 'إغلاق الحالة',
    logContact: 'تسجيل محاولة',
    noHoldCases: 'لا توجد حالات Hold',
    minutes: 'د',
    km: 'كم',
    inTransit: 'في الطريق',
    arriving: 'قريباً',
    delivered: 'تم التسليم',
    awaitingPickup: 'بانتظار الاستلام',
    orderNotFound: 'الطلب غير موجود',
    backToOrders: 'العودة للطلبات',
    subscriptionId: 'رقم الاشتراك',
    subscriptionDay: 'يوم الاشتراك',
    customerPhone: 'هاتف العميل',
    deliveryArea: 'منطقة التوصيل',
    deliveryAddress: 'العنوان (مخفي)',
    restaurantPhone: 'هاتف المطعم',
    restaurantContact: 'جهة الاتصال',
    lockedAt: 'وقت قفل −72h',
    sentToRestaurantAt: 'أُرسل للمطعم',
    allergens: 'الحساسية',
    dietaryNotes: 'ملاحظات غذائية',
    escalationNotes: 'ملاحظات التصعيد',
    restaurantContactAttempts: 'محاولات التواصل مع المطعم',
    alternativeRestaurants: 'مطاعم بديلة متاحة',
    mealCalories: 'السعرات',
    autoSelected: 'اختيار تلقائي',
    autoSelectedYes: 'نعم — اختيار تلقائي',
    autoSelectedNo: 'لا — اختار العميل',
    confirmationStatus: 'حالة التأكيد',
    confirmStatusPending: 'بانتظار التأكيد',
    confirmStatusOverdue: 'متأخر',
    confirmStatusConfirmed: 'مؤكد',
    confirmStatusReassigned: 'أُعيد التعيين',
    overdueAlertTitle: 'تأخر تأكيد المطعم',
    overdueAlertBody: 'تجاوزت مهلة التأكيد 24 ساعة. يُنصح بفتح نافذة بديل أو التواصل مع المطعم.',
    viewRestaurantAccount: 'ملف المطعم',
    panelOrderMeal: 'الطلب والوجبة',
    panelCustomerDelivery: 'العميل والتوصيل',
    panelSubscription: 'الاشتراك',
    panelRestaurantContact: 'بيانات المطعم',
    panelConfirmationSla: 'مهلة التأكيد',
    panelEscalation: 'التصعيد',
    panelTimeline: 'الجدول الزمني',
    panelOperations: 'التحضير والتوصيل',
    panelRestaurantSla: 'المطعم ومهلة التأكيد',
    opsNotStarted: 'لم يبدأ بعد — قبل مرحلة −24h',
    noExceptionsYet: 'لا توجد استثناءات مسجّلة',
    dayOfTotal: 'يوم {day} من {total}',
    kcal: 'سعرة',
  },
  en: {
    searchPlaceholder: 'Search by order ID, customer, or restaurant...',
    all: 'All',
    needsAction: 'Needs action',
    needsActionDesc: 'Overdue confirm, expiring replacement, or prep gaps',
    awaitingConfirm: 'Awaiting confirm',
    awaitingConfirmDesc: 'Within 24h confirmation window',
    replacement: 'Replacement windows',
    replacementDesc: '24h to pick replacement restaurant',
    prep24: '24h prep',
    prep24Desc: 'Barcode, invoice, and driver',
    todayOrders: "Today's orders",
    todayOrdersDesc: 'All active orders',
    customer: 'Customer',
    restaurant: 'Restaurant',
    deliveryDate: 'Delivery date',
    hoursLeft: 'Remaining',
    phase: 'Phase',
    sla: 'SLA',
    actions: 'Actions',
    actionMenu: 'Action',
    noOrders: 'No matching orders',
    noOrdersNeedsAction: 'No orders need action today',
    openReplacement: 'Open replacement',
    manualReassign: 'Reassign restaurant',
    applyException: 'Apply exception',
    viewDetails: 'View details',
    orderId: 'Order ID',
    meal: 'Meal',
    program: 'Program',
    bundle: 'Bundle',
    tier: 'Tier',
    yes: 'Yes',
    no: 'No',
    none: '—',
    unassigned: 'Unassigned',
    barcode: 'Barcode',
    invoice: 'Invoice',
    driver: 'Driver',
    confirmAction: 'Confirm action',
    cancel: 'Cancel',
    reason: 'Reason (required)',
    exceptionType: 'Exception type',
    submitException: 'Apply exception',
    changeBox: 'Change meal',
    changeRestaurant: 'Change restaurant',
    cancelDay: 'Cancel day',
    actor: 'Actor',
    appliedAt: 'Applied at',
    auditLog: 'Exception audit log',
    auditLogDesc: 'Audit trail for in-window admin actions',
    tabOverview: 'Overview',
    tabTimeline: 'Timeline',
    tabRestaurant: 'Restaurant',
    tabPrep: 'Prep & labels',
    tabDelivery: 'Delivery',
    tabExceptions: 'Exceptions',
    customerEditLocked: 'Customer edit locked',
    customerEditOpen: 'Customer can still edit',
    confirmDeadline: 'Confirm deadline',
    trackingTab: 'Live tracking',
    holdTab: 'Hold cases',
    activeDeliveries: 'Active deliveries',
    activeDesc: 'In transit or near customer',
    holdActive: 'Active holds',
    holdActiveDesc: 'Need follow-up and contact',
    area: 'Area',
    status: 'Status',
    eta: 'ETA',
    distance: 'Distance',
    pickupScan: 'Pickup',
    deliveryScan: 'Delivery',
    noTracking: 'No active deliveries',
    holdReason: 'Hold reason',
    holdStarted: 'Started',
    contactAttempts: 'Contact attempts',
    resolve: 'Resolve case',
    logContact: 'Log attempt',
    noHoldCases: 'No hold cases',
    minutes: 'm',
    km: 'km',
    inTransit: 'In transit',
    arriving: 'Arriving',
    delivered: 'Delivered',
    awaitingPickup: 'Awaiting pickup',
    orderNotFound: 'Order not found',
    backToOrders: 'Back to orders',
    subscriptionId: 'Subscription ID',
    subscriptionDay: 'Subscription day',
    customerPhone: 'Customer phone',
    deliveryArea: 'Delivery area',
    deliveryAddress: 'Address (masked)',
    restaurantPhone: 'Restaurant phone',
    restaurantContact: 'Contact person',
    lockedAt: '−72h lock time',
    sentToRestaurantAt: 'Sent to restaurant',
    allergens: 'Allergens',
    dietaryNotes: 'Dietary notes',
    escalationNotes: 'Escalation notes',
    restaurantContactAttempts: 'Restaurant contact attempts',
    alternativeRestaurants: 'Alternative restaurants',
    mealCalories: 'Calories',
    autoSelected: 'Auto-selected',
    autoSelectedYes: 'Yes — auto-selected',
    autoSelectedNo: 'No — customer choice',
    confirmationStatus: 'Confirmation status',
    confirmStatusPending: 'Pending',
    confirmStatusOverdue: 'Overdue',
    confirmStatusConfirmed: 'Confirmed',
    confirmStatusReassigned: 'Reassigned',
    overdueAlertTitle: 'Restaurant confirmation overdue',
    overdueAlertBody: 'The 24h confirmation window has passed. Open a replacement window or contact the restaurant.',
    viewRestaurantAccount: 'Restaurant account',
    panelOrderMeal: 'Order & meal',
    panelCustomerDelivery: 'Customer & delivery',
    panelSubscription: 'Subscription',
    panelRestaurantContact: 'Restaurant contact',
    panelConfirmationSla: 'Confirmation SLA',
    panelEscalation: 'Escalation',
    panelTimeline: 'Timeline',
    panelOperations: 'Prep & delivery',
    panelRestaurantSla: 'Restaurant & confirmation SLA',
    opsNotStarted: 'Not started yet — before −24h phase',
    noExceptionsYet: 'No exceptions recorded',
    dayOfTotal: 'Day {day} of {total}',
    kcal: 'kcal',
  },
};

export const ORDER_PHASE_LABELS: Record<OperationsLocale, Record<string, string>> = {
  ar: {
    editable: 'قابل للتعديل',
    locked_at_72h: 'مقفل −72h',
    awaiting_restaurant_confirmation: 'بانتظار التأكيد',
    confirmation_overdue: 'تأخر التأكيد',
    replacement_window_open: 'نافذة بديل',
    preparing_at_24h: 'تحضير −24h',
    delivered: 'تم التوصيل',
  },
  en: {
    editable: 'Editable',
    locked_at_72h: 'Locked −72h',
    awaiting_restaurant_confirmation: 'Awaiting confirm',
    confirmation_overdue: 'Overdue',
    replacement_window_open: 'Replacement open',
    preparing_at_24h: 'Prep −24h',
    delivered: 'Delivered',
  },
};

export const DELIVERY_STATUS_LABELS: Record<OperationsLocale, Record<string, string>> = {
  ar: {
    awaiting_pickup: 'بانتظار الاستلام',
    picked_up: 'تم الاستلام',
    in_transit: 'في الطريق',
    arriving: 'قريباً',
    delivered: 'تم التسليم',
    failed: 'فشل',
  },
  en: {
    awaiting_pickup: 'Awaiting pickup',
    picked_up: 'Picked up',
    in_transit: 'In transit',
    arriving: 'Arriving',
    delivered: 'Delivered',
    failed: 'Failed',
  },
};

export const HOLD_STATUS_LABELS: Record<OperationsLocale, Record<string, string>> = {
  ar: { active: 'نشطة', contact_pending: 'بانتظار التواصل', resolved: 'تم الحل' },
  en: { active: 'Active', contact_pending: 'Contact pending', resolved: 'Resolved' },
};
