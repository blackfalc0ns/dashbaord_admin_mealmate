export type RestaurantsLocale = 'ar' | 'en';

export interface RestaurantsCopy {
  overview: string;
  accounts: string;
  partnerRestaurants: string;
  restaurantsDirectory: string;
  restaurantsDesc: string;
  realtimeSyncActive: string;
  activeRestaurants: string;
  activeDesc: string;
  suspendedRestaurants: string;
  suspendedDesc: string;
  operationalSetup: string;
  setupDesc: string;
  totalRestaurants: string;
  totalDesc: string;
  searchPlaceholder: string;
  all: string;
  active: string;
  suspended: string;
  readyToLive: string;
  restaurantAndCompany: string;
  crNumber: string;
  contactPerson: string;
  dailyCapacity: string;
  status: string;
  actions: string;
  mealsDay: string;
  viewProfile: string;
  noRestaurantsFound: string;
  showingPage: string;
  of: string;
  restaurantPartnerProfile: string;
  restaurantId: string;
  legalCompanyInfo: string;
  tradeName: string;
  legalCompanyName: string;
  mainAddress: string;
  name: string;
  phone: string;
  email: string;
  operationalSettings: string;
  activePrograms: string;
  serviceRegions: string;
  legalDocuments: string;
  close: string;
  manualAudit: string;
  unsuspendAccount: string;
  suspendAccount: string;
  verified: string;
  reviewNotes: string;
  settlementCommissionTitle: string;
  settlementCommissionDesc: string;
  settlementCommissionNote: string;
  settlementCommissionUpdated: string;
  saveCommission: string;
  commissionSaved: string;
}

export const RESTAURANTS_ACCOUNTS_I18N: Record<RestaurantsLocale, RestaurantsCopy> = {
  ar: {
    overview: 'الرئيسية',
    accounts: 'الحسابات',
    partnerRestaurants: 'المطاعم الشريكة',
    restaurantsDirectory: 'إدارة حسابات المطاعم الشريكة',
    restaurantsDesc: 'مراقبة وإدارة حسابات المطاعم النشطة والموقوفة، ومتابعة الإعدادات التشغيلية والقدرة الاستيعابية اليومية ومناطق التغطية لكل مطعم شريك.',
    realtimeSyncActive: 'مزامنة البيانات فورية',
    activeRestaurants: 'المطاعم النشطة',
    activeDesc: 'تظهر للعملاء في التقويم الذكي وتستقبل الطلبات',
    suspendedRestaurants: 'المطاعم الموقوفة',
    suspendedDesc: 'موقوفة مؤقتاً بسبب الجودة أو انتهاء التراخيص',
    operationalSetup: 'قيد الإعداد التشغيلي',
    setupDesc: 'معتمدة قانونياً وبانتظار المنيو والأسعار',
    totalRestaurants: 'إجمالي المطاعم الشريكة',
    totalDesc: 'إجمالي المطاعم المسجلة في قاعدة البيانات',
    searchPlaceholder: 'ابحث بالاسم، السجل، الهاتف...',
    all: 'الكل',
    active: 'نشط',
    suspended: 'موقوف',
    readyToLive: 'جاهز للإطلاق',
    restaurantAndCompany: 'المطعم والشركة',
    crNumber: 'رقم السجل التجاري',
    contactPerson: 'مسؤول التواصل',
    dailyCapacity: 'القدرة اليومية',
    status: 'الحالة',
    actions: 'الإجراءات',
    mealsDay: 'وجبة/يوم',
    viewProfile: 'عرض الملف',
    noRestaurantsFound: 'لا توجد مطاعم مطابقة للبحث',
    showingPage: 'عرض الصفحة',
    of: 'من أصل',
    restaurantPartnerProfile: 'ملف المطعم الشريك',
    restaurantId: 'معرّف المطعم:',
    legalCompanyInfo: 'المعلومات القانونية والشركة',
    tradeName: 'الاسم التجاري',
    legalCompanyName: 'اسم الشركة القانوني',
    mainAddress: 'العنوان الرئيسي',
    name: 'الاسم',
    phone: 'رقم الهاتف',
    email: 'البريد الإلكتروني',
    operationalSettings: 'الإعدادات التشغيلية',
    activePrograms: 'البرامج الغذائية النشطة',
    serviceRegions: 'مناطق التغطية والخدمة',
    legalDocuments: 'المستندات والوثائق القانونية',
    close: 'إغلاق',
    manualAudit: 'فحص امتثال يدوي',
    unsuspendAccount: 'إلغاء الإيقاف المؤقت',
    suspendAccount: 'إيقاف الحساب مؤقتاً',
    verified: 'معتمد',
    reviewNotes: 'ملاحظات المراجعة والتشغيل',
    settlementCommissionTitle: 'عمولة تسوية المطعم',
    settlementCommissionDesc: 'تُخصم من سعر العلبة المتفق عليه عند التسوية — منفصلة عن عمولة اشتراك العميل على المنصة.',
    settlementCommissionNote: 'التغييرات تُطبَّق على التسويات الجديدة فقط.',
    settlementCommissionUpdated: 'آخر تحديث',
    saveCommission: 'حفظ العمولة',
    commissionSaved: 'تم حفظ عمولة التسوية',
  },
  en: {
    overview: 'Overview',
    accounts: 'Accounts',
    partnerRestaurants: 'Restaurants',
    restaurantsDirectory: 'Restaurants Accounts Directory',
    restaurantsDesc: 'Monitor and manage active, suspended, and setup-pending restaurant accounts. Track daily capacity, active menus, and service coverage for each partner restaurant.',
    realtimeSyncActive: 'Real-time Sync Active',
    activeRestaurants: 'Active Restaurants',
    activeDesc: 'Visible to customers in smart calendar',
    suspendedRestaurants: 'Suspended Restaurants',
    suspendedDesc: 'Temporarily suspended due to quality or license',
    operationalSetup: 'Operational Setup',
    setupDesc: 'Legally approved, awaiting menu & prices',
    totalRestaurants: 'Total Restaurants',
    totalDesc: 'Total registered restaurants in database',
    searchPlaceholder: 'Search by name, CR, phone...',
    all: 'All',
    active: 'Active',
    suspended: 'Suspended',
    readyToLive: 'Ready to Live',
    restaurantAndCompany: 'Restaurant & Company',
    crNumber: 'CR Number',
    contactPerson: 'Contact Person',
    dailyCapacity: 'Daily Capacity',
    status: 'Status',
    actions: 'Actions',
    mealsDay: 'meals/day',
    viewProfile: 'View Profile',
    noRestaurantsFound: 'No restaurants match the search criteria',
    showingPage: 'Showing page',
    of: 'of',
    restaurantPartnerProfile: 'Restaurant Partner Profile',
    restaurantId: 'Restaurant ID:',
    legalCompanyInfo: 'Legal & Company Info',
    tradeName: 'Trade Name',
    legalCompanyName: 'Legal Company Name',
    mainAddress: 'Main Address',
    name: 'Name',
    phone: 'Phone',
    email: 'Email',
    operationalSettings: 'Operational Settings',
    activePrograms: 'Active Programs',
    serviceRegions: 'Service Regions',
    legalDocuments: 'Verified Documents',
    close: 'Close',
    manualAudit: 'Manual Audit',
    unsuspendAccount: 'Unsuspend Account',
    suspendAccount: 'Suspend Account',
    verified: 'Verified',
    reviewNotes: 'Review & Operations Notes',
    settlementCommissionTitle: 'Restaurant settlement commission',
    settlementCommissionDesc: 'Deducted from the agreed box price at settlement — separate from customer subscription commission.',
    settlementCommissionNote: 'Changes apply to new settlements only.',
    settlementCommissionUpdated: 'Last updated',
    saveCommission: 'Save commission',
    commissionSaved: 'Settlement commission saved',
  },
};
