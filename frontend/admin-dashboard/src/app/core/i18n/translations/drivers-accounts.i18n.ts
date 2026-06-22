export type DriversLocale = 'ar' | 'en';

export interface DriversCopy {
  overview: string;
  accounts: string;
  partnerDrivers: string;
  driversDirectory: string;
  driversDesc: string;
  realtimeSyncActive: string;
  activeDrivers: string;
  activeDesc: string;
  suspendedDrivers: string;
  suspendedDesc: string;
  expiredDocuments: string;
  expiredDesc: string;
  profileImageReview: string;
  imageReviewDesc: string;
  searchPlaceholder: string;
  all: string;
  active: string;
  imageReview: string;
  expiredDocs: string;
  suspended: string;
  driverAndInfo: string;
  phoneAndEmail: string;
  vehicleAndPlate: string;
  serviceRegion: string;
  status: string;
  actions: string;
  viewProfile: string;
  noDriversFound: string;
  showingPage: string;
  of: string;
  driverPartnerProfile: string;
  driverId: string;
  profileImage: string;
  approved: string;
  pendingReview: string;
  contactDetails: string;
  phone: string;
  email: string;
  vehicleInformation: string;
  vehicleType: string;
  plateNumber: string;
  requiredDocuments: string;
  expiry: string;
  verified: string;
  expired: string;
  underReview: string;
  reviewNotes: string;
  close: string;
  sendExpiryWarning: string;
  approveImage: string;
  unsuspendAccount: string;
  suspendAccount: string;
}

export const DRIVERS_ACCOUNTS_I18N: Record<DriversLocale, DriversCopy> = {
  ar: {
    overview: 'الرئيسية',
    accounts: 'الحسابات',
    partnerDrivers: 'السائقون الشركاء',
    driversDirectory: 'إدارة حسابات السائقين الشركاء',
    driversDesc: 'مراقبة وإدارة حسابات السائقين النشطة والموقوفة، ومتابعة مراجعة الصور الشخصية وتواريخ انتهاء رخص القيادة ودفاتر المركبات لضمان الامتثال المستمر.',
    realtimeSyncActive: 'مزامنة البيانات فورية',
    activeDrivers: 'السائقون النشطون',
    activeDesc: 'يستقبلون طلبات التوصيل اليومية بشكل طبيعي',
    suspendedDrivers: 'السائقون الموقوفون',
    suspendedDesc: 'موقوفون مؤقتاً بسبب التأخير أو مخالفة القواعد',
    expiredDocuments: 'مستندات منتهية',
    expiredDesc: 'تم إيقاف استقبال الطلبات تلقائياً لانتهاء وثيقة',
    profileImageReview: 'مراجعة الصورة الشخصية',
    imageReviewDesc: 'صور شخصية جديدة محدثة تحتاج مراجعة بصرية',
    searchPlaceholder: 'ابحث بالاسم، الهاتف، اللوحة...',
    all: 'الكل',
    active: 'نشط',
    imageReview: 'مراجعة الصورة',
    expiredDocs: 'مستندات منتهية',
    suspended: 'موقوف',
    driverAndInfo: 'السائق والمعلومات',
    phoneAndEmail: 'رقم الهاتف والبريد',
    vehicleAndPlate: 'المركبة واللوحة',
    serviceRegion: 'نطاق التغطية',
    status: 'الحالة',
    actions: 'الإجراءات',
    viewProfile: 'عرض الملف',
    noDriversFound: 'لا توجد سائقون مطابقون للبحث',
    showingPage: 'عرض الصفحة',
    of: 'من أصل',
    driverPartnerProfile: 'ملف السائق الشريك',
    driverId: 'معرّف السائق:',
    profileImage: 'الصورة الشخصية:',
    approved: 'معتمدة',
    pendingReview: 'قيد المراجعة',
    contactDetails: 'بيانات الاتصال',
    phone: 'رقم الهاتف',
    email: 'البريد الإلكتروني',
    vehicleInformation: 'بيانات المركبة ووسيلة النقل',
    vehicleType: 'نوع المركبة',
    plateNumber: 'رقم لوحة السيارة',
    requiredDocuments: 'المستندات والوثائق القانونية',
    expiry: 'تاريخ الانتهاء:',
    verified: 'معتمد',
    expired: 'منتهي الصلاحية',
    underReview: 'تحت المراجعة',
    reviewNotes: 'ملاحظات المراجعة والتشغيل',
    close: 'إغلاق',
    sendExpiryWarning: 'تنبيه تجديد مستندات',
    approveImage: 'اعتماد الصورة الشخصية',
    unsuspendAccount: 'إلغاء الإيقاف المؤقت',
    suspendAccount: 'إيقاف الحساب مؤقتاً',
  },
  en: {
    overview: 'Overview',
    accounts: 'Accounts',
    partnerDrivers: 'Drivers',
    driversDirectory: 'Drivers Accounts Directory',
    driversDesc: 'Monitor and manage active, suspended, and document-expired driver accounts. Track profile image reviews, driving license validity, and vehicle registrations.',
    realtimeSyncActive: 'Real-time Sync Active',
    activeDrivers: 'Active Drivers',
    activeDesc: 'Receiving daily delivery orders normally',
    suspendedDrivers: 'Suspended Drivers',
    suspendedDesc: 'Temporarily suspended due to delays or violations',
    expiredDocuments: 'Expired Documents',
    expiredDesc: 'Order assignment disabled due to expired files',
    profileImageReview: 'Profile Image Review',
    imageReviewDesc: 'New profile images awaiting visual admin check',
    searchPlaceholder: 'Search by name, phone, plate...',
    all: 'All',
    active: 'Active',
    imageReview: 'Image Review',
    expiredDocs: 'Expired Docs',
    suspended: 'Suspended',
    driverAndInfo: 'Driver & Info',
    phoneAndEmail: 'Phone & Email',
    vehicleAndPlate: 'Vehicle & Plate',
    serviceRegion: 'Service Region',
    status: 'Status',
    actions: 'Actions',
    viewProfile: 'View Profile',
    noDriversFound: 'No drivers match the search criteria',
    showingPage: 'Showing page',
    of: 'of',
    driverPartnerProfile: 'Driver Partner Profile',
    driverId: 'Driver ID:',
    profileImage: 'Profile Image:',
    approved: 'Approved',
    pendingReview: 'Pending Review',
    contactDetails: 'Contact Details',
    phone: 'Phone',
    email: 'Email',
    vehicleInformation: 'Vehicle Information',
    vehicleType: 'Vehicle Type',
    plateNumber: 'Plate Number',
    requiredDocuments: 'Required Documents',
    expiry: 'Expiry:',
    verified: 'Verified',
    expired: 'Expired',
    underReview: 'Under review',
    reviewNotes: 'Review & Operations Notes',
    close: 'Close',
    sendExpiryWarning: 'Send Expiry Warning',
    approveImage: 'Approve Image',
    unsuspendAccount: 'Unsuspend Account',
    suspendAccount: 'Suspend Account',
  },
};
