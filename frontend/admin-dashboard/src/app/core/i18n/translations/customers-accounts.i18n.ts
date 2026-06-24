export type CustomersLocale = 'ar' | 'en';

export interface CustomersCopy {
  activeCustomers: string;
  activeDesc: string;
  frozenCustomers: string;
  frozenDesc: string;
  noSubscriptionCustomers: string;
  noSubscriptionDesc: string;
  suspendedCustomers: string;
  suspendedDesc: string;
  searchPlaceholder: string;
  all: string;
  active: string;
  frozen: string;
  noSubscription: string;
  cancelled: string;
  suspended: string;
  customerAndInfo: string;
  phoneAndEmail: string;
  subscriptionSummary: string;
  serviceArea: string;
  status: string;
  actions: string;
  viewProfile: string;
  noCustomersFound: string;
  showingPage: string;
  of: string;
  customerId: string;
  contactDetails: string;
  phone: string;
  email: string;
  suspendAccount: string;
  unsuspendAccount: string;
  freezeSubscription: string;
  unfreezeSubscription: string;
  tabOverview: string;
  tabDetails: string;
  tabSubscription: string;
  tabWallet: string;
  tabSettings: string;
  program: string;
  bundle: string;
  tier: string;
  subscriptionDays: string;
  usedDays: string;
  remainingDays: string;
  walletBalance: string;
  loyaltyPoints: string;
  totalOrders: string;
  complaints: string;
  allergies: string;
  dislikes: string;
  joinedAt: string;
  lastActivity: string;
  noActiveSubscription: string;
  walletTransactions: string;
  credit: string;
  debit: string;
  quickActions: string;
  familySubscription: string;
  individualSubscription: string;
  familyManager: string;
  familyMember: string;
  familyGroup: string;
  familyMembers: string;
  memberRole: string;
  memberQuota: string;
  viewMember: string;
  linkedToFamily: string;
}

export const CUSTOMERS_ACCOUNTS_I18N: Record<CustomersLocale, CustomersCopy> = {
  ar: {
    activeCustomers: 'عملاء نشطون',
    activeDesc: 'اشتراك فعّال وتسليمات مستمرة',
    frozenCustomers: 'مجمّدون',
    frozenDesc: 'اشتراك مجمّد مؤقتاً',
    noSubscriptionCustomers: 'بدون اشتراك',
    noSubscriptionDesc: 'مسجلون بدون اشتراك نشط',
    suspendedCustomers: 'موقوفون',
    suspendedDesc: 'حساب موقوف إدارياً',
    searchPlaceholder: 'ابحث بالاسم، الهاتف، البريد...',
    all: 'الكل',
    active: 'نشط',
    frozen: 'مجمّد',
    noSubscription: 'بدون اشتراك',
    cancelled: 'ملغي',
    suspended: 'موقوف',
    customerAndInfo: 'العميل والمعلومات',
    phoneAndEmail: 'الهاتف والبريد',
    subscriptionSummary: 'الاشتراك',
    serviceArea: 'منطقة الخدمة',
    status: 'الحالة',
    actions: 'إجراءات',
    viewProfile: 'عرض الملف',
    noCustomersFound: 'لا يوجد عملاء مطابقون',
    showingPage: 'صفحة',
    of: 'من',
    customerId: 'معرّف العميل',
    contactDetails: 'بيانات التواصل',
    phone: 'الهاتف',
    email: 'البريد',
    suspendAccount: 'إيقاف الحساب',
    unsuspendAccount: 'إلغاء الإيقاف',
    freezeSubscription: 'تجميد الاشتراك',
    unfreezeSubscription: 'إلغاء التجميد',
    tabOverview: 'نظرة عامة',
    tabDetails: 'البيانات الشخصية',
    tabSubscription: 'الاشتراك',
    tabWallet: 'المحفظة',
    tabSettings: 'الإعدادات',
    program: 'البرنامج',
    bundle: 'الباقة',
    tier: 'التصنيف',
    subscriptionDays: 'أيام الاشتراك',
    usedDays: 'الأيام المستخدمة',
    remainingDays: 'الأيام المتبقية',
    walletBalance: 'رصيد المحفظة',
    loyaltyPoints: 'نقاط الولاء',
    totalOrders: 'إجمالي الطلبات',
    complaints: 'الشكاوى',
    allergies: 'الحساسية',
    dislikes: 'غير المفضّل',
    joinedAt: 'تاريخ التسجيل',
    lastActivity: 'آخر نشاط',
    noActiveSubscription: 'لا يوجد اشتراك نشط',
    walletTransactions: 'حركات المحفظة',
    credit: 'إضافة',
    debit: 'خصم',
    quickActions: 'إجراءات سريعة',
    familySubscription: 'اشتراك عائلي',
    individualSubscription: 'اشتراك فردي',
    familyManager: 'مدير العائلة',
    familyMember: 'فرد عائلة',
    familyGroup: 'المجموعة العائلية',
    familyMembers: 'أفراد العائلة',
    memberRole: 'الدور',
    memberQuota: 'الحصة',
    viewMember: 'عرض الفرد',
    linkedToFamily: 'مرتبط باشتراك عائلي',
  },
  en: {
    activeCustomers: 'Active customers',
    activeDesc: 'Active subscription with ongoing deliveries',
    frozenCustomers: 'Frozen',
    frozenDesc: 'Subscription temporarily frozen',
    noSubscriptionCustomers: 'No subscription',
    noSubscriptionDesc: 'Registered without active subscription',
    suspendedCustomers: 'Suspended',
    suspendedDesc: 'Account suspended by admin',
    searchPlaceholder: 'Search by name, phone, email...',
    all: 'All',
    active: 'Active',
    frozen: 'Frozen',
    noSubscription: 'No subscription',
    cancelled: 'Cancelled',
    suspended: 'Suspended',
    customerAndInfo: 'Customer & info',
    phoneAndEmail: 'Phone & email',
    subscriptionSummary: 'Subscription',
    serviceArea: 'Service area',
    status: 'Status',
    actions: 'Actions',
    viewProfile: 'View profile',
    noCustomersFound: 'No matching customers',
    showingPage: 'Page',
    of: 'of',
    customerId: 'Customer ID',
    contactDetails: 'Contact details',
    phone: 'Phone',
    email: 'Email',
    suspendAccount: 'Suspend account',
    unsuspendAccount: 'Unsuspend account',
    freezeSubscription: 'Freeze subscription',
    unfreezeSubscription: 'Unfreeze subscription',
    tabOverview: 'Overview',
    tabDetails: 'Profile',
    tabSubscription: 'Subscription',
    tabWallet: 'Wallet',
    tabSettings: 'Settings',
    program: 'Program',
    bundle: 'Bundle',
    tier: 'Tier',
    subscriptionDays: 'Subscription days',
    usedDays: 'Used days',
    remainingDays: 'Remaining days',
    walletBalance: 'Wallet balance',
    loyaltyPoints: 'Loyalty points',
    totalOrders: 'Total orders',
    complaints: 'Complaints',
    allergies: 'Allergies',
    dislikes: 'Dislikes',
    joinedAt: 'Joined',
    lastActivity: 'Last activity',
    noActiveSubscription: 'No active subscription',
    walletTransactions: 'Wallet transactions',
    credit: 'Credit',
    debit: 'Debit',
    quickActions: 'Quick actions',
    familySubscription: 'Family subscription',
    individualSubscription: 'Individual subscription',
    familyManager: 'Family manager',
    familyMember: 'Family member',
    familyGroup: 'Family group',
    familyMembers: 'Family members',
    memberRole: 'Role',
    memberQuota: 'Quota',
    viewMember: 'View member',
    linkedToFamily: 'Linked to family subscription',
  },
};
