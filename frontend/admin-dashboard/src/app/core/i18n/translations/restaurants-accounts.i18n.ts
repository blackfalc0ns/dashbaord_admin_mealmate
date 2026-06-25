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
  ingredientSourcesTitle: string;
  ingredientSourcesDesc: string;
  ingredientDetailWindow: string;
  ingredientGrade: string;
  ingredientOrigin: string;
  ingredientSupplier: string;
  ingredientHalal: string;
  ingredientLastUpdated: string;
  ingredientNotes: string;
  ingredientTraceRef: string;
  ingredientSourcesEmpty: string;
  ingredientTotalComponents: string;
  ingredientImportedCount: string;
  ingredientLocalCount: string;
  ingredientHalalVerified: string;
  ingredientBrand: string;
  ingredientStorage: string;
  ingredientPrograms: string;
  ingredientCertExpiry: string;
  ingredientHalalCert: string;
  ingredientOrganic: string;
  ingredientMenuShare: string;
  ingredientVarieties: string;
  ingredientSupplierCountry: string;
  ingredientFilterAll: string;
  ingredientAllergens: string;
  ingredientDeliveryFrequency: string;
  ingredientInspectionScore: string;
  ingredientHaccp: string;
  ingredientGmoFree: string;
  ingredientGrassFed: string;
  ingredientCarbonFootprint: string;
  ingredientCarbonLow: string;
  ingredientCarbonMedium: string;
  ingredientCarbonHigh: string;
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
    ingredientSourcesTitle: 'المكونات الرئيسية للوجبات',
    ingredientSourcesDesc: 'نظام كروت تفصيلي للمكوّنات الرئيسية — اللحوم والدواجن والأسماك والأجبان وبلدان الاستيراد',
    ingredientDetailWindow: 'مصادر وجودة المكونات',
    ingredientGrade: 'النوع والدرجة',
    ingredientOrigin: 'بلد المنشأ / الاستيراد',
    ingredientSupplier: 'المورّد',
    ingredientHalal: 'شهادة الحلال',
    ingredientLastUpdated: 'آخر تحديث',
    ingredientNotes: 'ملاحظات المطعم',
    ingredientTraceRef: 'مرجع التتبع',
    ingredientSourcesEmpty: 'لم يُعلن المطعم بعد عن مكونات الوجبات الرئيسية ومصادر الاستيراد.',
    ingredientTotalComponents: 'إجمالي المكوّنات',
    ingredientImportedCount: 'مستورد',
    ingredientLocalCount: 'محلي',
    ingredientHalalVerified: 'حلال معتمد',
    ingredientBrand: 'العلامة التجارية',
    ingredientStorage: 'التخزين والصلاحية',
    ingredientPrograms: 'البرامج المستخدمة فيها',
    ingredientCertExpiry: 'انتهاء الشهادة',
    ingredientHalalCert: 'جهة اعتماد الحلال',
    ingredientOrganic: 'عضوي',
    ingredientMenuShare: 'حصة المنيو',
    ingredientVarieties: 'الأصناف والمنشأ',
    ingredientSupplierCountry: 'بلد المورّد',
    ingredientFilterAll: 'الكل',
    ingredientAllergens: 'المثيرات للحساسية',
    ingredientDeliveryFrequency: 'وتيرة التوريد',
    ingredientInspectionScore: 'تقييم التفتيش الصحي',
    ingredientHaccp: 'شهادة HACCP',
    ingredientGmoFree: 'خالي من التعديل الوراثي',
    ingredientGrassFed: 'تغذية طبيعية / حرة',
    ingredientCarbonFootprint: 'الأثر الكربوني',
    ingredientCarbonLow: 'منخفض',
    ingredientCarbonMedium: 'متوسط',
    ingredientCarbonHigh: 'مرتفع',
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
    ingredientSourcesTitle: 'Main Meal Ingredients',
    ingredientSourcesDesc: 'Detailed card system for main ingredients — meat, poultry, fish, cheese and import origins',
    ingredientDetailWindow: 'Ingredient Sourcing & Quality',
    ingredientGrade: 'Type & grade',
    ingredientOrigin: 'Origin / import country',
    ingredientSupplier: 'Supplier',
    ingredientHalal: 'Halal certification',
    ingredientLastUpdated: 'Last updated',
    ingredientNotes: 'Restaurant notes',
    ingredientTraceRef: 'Trace reference',
    ingredientSourcesEmpty: 'This restaurant has not declared main meal ingredients and import origins yet.',
    ingredientTotalComponents: 'Total components',
    ingredientImportedCount: 'Imported',
    ingredientLocalCount: 'Local',
    ingredientHalalVerified: 'Halal verified',
    ingredientBrand: 'Brand',
    ingredientStorage: 'Storage & shelf life',
    ingredientPrograms: 'Used in programs',
    ingredientCertExpiry: 'Certificate expiry',
    ingredientHalalCert: 'Halal certifier',
    ingredientOrganic: 'Organic',
    ingredientMenuShare: 'Menu share',
    ingredientVarieties: 'Varieties & origin',
    ingredientSupplierCountry: 'Supplier country',
    ingredientFilterAll: 'All',
    ingredientAllergens: 'Allergens',
    ingredientDeliveryFrequency: 'Delivery frequency',
    ingredientInspectionScore: 'Health inspection score',
    ingredientHaccp: 'HACCP certified',
    ingredientGmoFree: 'Non-GMO',
    ingredientGrassFed: 'Free-range / Grass-fed',
    ingredientCarbonFootprint: 'Carbon footprint',
    ingredientCarbonLow: 'Low',
    ingredientCarbonMedium: 'Medium',
    ingredientCarbonHigh: 'High',
  },
};
