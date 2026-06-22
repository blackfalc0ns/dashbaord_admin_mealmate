export type PendingLocale = 'ar' | 'en';

export interface PendingCopy {
  overview: string;
  accounts: string;
  pendingApprovals: string;
  gatewayTitle: string;
  gatewayDesc: string;
  autoVerificationActive: string;
  pendingRestaurants: string;
  awaitingLicenseCheck: string;
  pendingDrivers: string;
  awaitingDriverLicenseCheck: string;
  readyToApprove: string;
  readyToApproveDesc: string;
  missingDocuments: string;
  missingDocumentsDesc: string;
  searchPlaceholder: string;
  all: string;
  restaurants: string;
  drivers: string;
  allStatuses: string;
  ready: string;
  review: string;
  missing: string;
  nameAndInfo: string;
  type: string;
  submittedAt: string;
  verificationStatus: string;
  actions: string;
  restaurant: string;
  driver: string;
  reviewDetails: string;
  noPendingRequests: string;
  adjustSearch: string;
  showingPage: string;
  of: string;
  reviewApprovalRequest: string;
  requestId: string;
  basicInformation: string;
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  address: string;
  vehicleAndPlate: string;
  requiredDocuments: string;
  clickDocToToggle: string;
  clickToVerify: string;
  verified: string;
  underReview: string;
  requestedPrograms: string;
  reviewNotes: string;
  cancel: string;
  rejectRequest: string;
  requestDocs: string;
  approveAndActivate: string;
}

export const PENDING_ACCOUNTS_I18N: Record<PendingLocale, PendingCopy> = {
  ar: {
    overview: 'الرئيسية',
    accounts: 'الحسابات',
    pendingApprovals: 'الاعتمادات المعلقة',
    gatewayTitle: 'بوابة الاعتمادات والتحقق من الحسابات',
    gatewayDesc: 'مراجعة واعتماد طلبات تسجيل المطاعم والسائقين الجدد، والتحقق من الوثائق القانونية والصحية لضمان الامتثال لمعايير الجودة والأمان.',
    autoVerificationActive: 'نظام الاعتماد التلقائي نشط',
    pendingRestaurants: 'مطاعم قيد الانتظار',
    awaitingLicenseCheck: 'بانتظار التحقق من التراخيص والشهادات الصحية',
    pendingDrivers: 'سائقون قيد الانتظار',
    awaitingDriverLicenseCheck: 'بانتظار التحقق من رخص القيادة ودفاتر المركبات',
    readyToApprove: 'جاهز للاعتماد الفوري',
    readyToApproveDesc: 'اكتملت جميع المستندات وجاهزة للتفعيل بضغطة واحدة',
    missingDocuments: 'طلبات غير مكتملة',
    missingDocumentsDesc: 'تم إرسال تنبيهات تلقائية لاستكمال النواقص',
    searchPlaceholder: 'ابحث بالاسم، البريد الإلكتروني...',
    all: 'الكل',
    restaurants: 'المطاعم',
    drivers: 'السائقون',
    allStatuses: 'جميع الحالات',
    ready: 'جاهز للاعتماد',
    review: 'قيد المراجعة',
    missing: 'وثائق ناقصة',
    nameAndInfo: 'الاسم والمعلومات',
    type: 'النوع',
    submittedAt: 'تاريخ التقديم',
    verificationStatus: 'حالة التحقق',
    actions: 'الإجراءات',
    restaurant: 'مطعم',
    driver: 'سائق',
    reviewDetails: 'مراجعة التفاصيل',
    noPendingRequests: 'لا توجد طلبات اعتماد مطابقة للفلاتر',
    adjustSearch: 'يرجى تعديل خيارات البحث أو الفلترة والمحاولة مرة أخرى.',
    showingPage: 'عرض الصفحة',
    of: 'من أصل',
    reviewApprovalRequest: 'مراجعة طلب الاعتماد',
    requestId: 'معرّف الطلب:',
    basicInformation: 'المعلومات الأساسية',
    fullName: 'الاسم الكامل',
    phoneNumber: 'رقم الهاتف',
    emailAddress: 'البريد الإلكتروني',
    address: 'العنوان',
    vehicleAndPlate: 'المركبة واللوحة',
    requiredDocuments: 'الوثائق والمستندات المطلوبة',
    clickDocToToggle: 'اضغط على المستند لتغيير حالته',
    clickToVerify: 'اضغط للتحقق والتغيير',
    verified: 'معتمد',
    underReview: 'تحت المراجعة',
    requestedPrograms: 'البرامج الغذائية المطلوبة',
    reviewNotes: 'ملاحظات المراجعة والتشغيل',
    cancel: 'إلغاء',
    rejectRequest: 'رفض الطلب',
    requestDocs: 'طلب استكمال مستندات',
    approveAndActivate: 'اعتماد وتفعيل الحساب',
  },
  en: {
    overview: 'Overview',
    accounts: 'Accounts',
    pendingApprovals: 'Pending Approvals',
    gatewayTitle: 'Approvals & Verification Gateway',
    gatewayDesc: 'Review and approve registration requests for new restaurants and drivers, and verify legal and health documents to ensure compliance with quality and safety standards.',
    autoVerificationActive: 'Auto-Verification Active',
    pendingRestaurants: 'Pending Restaurants',
    awaitingLicenseCheck: 'Awaiting license and health cert checks',
    pendingDrivers: 'Pending Drivers',
    awaitingDriverLicenseCheck: 'Awaiting driver license and registration checks',
    readyToApprove: 'Ready to Approve',
    readyToApproveDesc: 'All documents verified, ready for 1-click activation',
    missingDocuments: 'Missing Documents',
    missingDocumentsDesc: 'Automated reminders sent for missing files',
    searchPlaceholder: 'Search by name, email...',
    all: 'All',
    restaurants: 'Restaurants',
    drivers: 'Drivers',
    allStatuses: 'All Statuses',
    ready: 'Ready',
    review: 'Review',
    missing: 'Missing',
    nameAndInfo: 'Name & Info',
    type: 'Type',
    submittedAt: 'Submitted At',
    verificationStatus: 'Verification Status',
    actions: 'Actions',
    restaurant: 'Restaurant',
    driver: 'Driver',
    reviewDetails: 'Review Details',
    noPendingRequests: 'No pending approval requests match the filters',
    adjustSearch: 'Please adjust search or filter options and try again.',
    showingPage: 'Showing page',
    of: 'of',
    reviewApprovalRequest: 'Review Approval Request',
    requestId: 'Request ID:',
    basicInformation: 'Basic Information',
    fullName: 'Full Name',
    phoneNumber: 'Phone Number',
    emailAddress: 'Email Address',
    address: 'Address',
    vehicleAndPlate: 'Vehicle & Plate',
    requiredDocuments: 'Required Documents',
    clickDocToToggle: 'Click document to toggle status',
    clickToVerify: 'Click to verify and toggle',
    verified: 'Verified',
    underReview: 'Under review',
    requestedPrograms: 'Requested Programs',
    reviewNotes: 'Review & Operations Notes',
    cancel: 'Cancel',
    rejectRequest: 'Reject Request',
    requestDocs: 'Request Docs',
    approveAndActivate: 'Approve & Activate',
  },
};
