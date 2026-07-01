export type FinanceLocale = 'ar' | 'en';

export interface FinanceCopy {
  searchPlaceholder: string;
  all: string;
  viewDetails: string;
  openCustomer: string;
  noResults: string;
  close: string;
  days: string;
  kd: string;
  colCustomer: string;
  colSubType: string;
  colProgramBundle: string;
  colRequestedAt: string;
  colPaid: string;
  colRemaining: string;
  colFee: string;
  colNetRefund: string;
  colRefundMethod: string;
  colStatus: string;
  colActions: string;
  kpiPendingReview: string;
  kpiProcessing: string;
  kpiCompletedMonth: string;
  kpiRefundedMonth: string;
  filterPendingReview: string;
  filterProcessing: string;
  filterCompleted: string;
  filterRejected: string;
  filterDispute: string;
  paginationCancellations: string;
  policyTitle: string;
  policyDefaultFee: string;
  policyDefaultFeeDesc: string;
  policyOperationalDays: string;
  policyOperationalDaysDesc: string;
  policyUpdatedBy: string;
  policySave: string;
  policySaved: string;
  cancellationDetailTitle: string;
  colSubscriptionStart: string;
  colTotalDays: string;
  colUsedDays: string;
  colRefundableBase: string;
  colFeeAmount: string;
  colCustomerReason: string;
  colCancellationFeePct: string;
  feeInputHint: string;
  feeNotSet: string;
  feeSave: string;
  feeSaved: string;
  previewFee: string;
  previewNetRefund: string;
  disputeNote: string;
  highValueBadge: string;
  superAdminBadge: string;
  approveRefund: string;
  approveConfirm: string;
  approveRequiresFee: string;
  rejectRefund: string;
  rejectConfirm: string;
  completeRefund: string;
  completeConfirm: string;
  approvedToast: string;
  rejectedToast: string;
  completedToast: string;
  zeroRefundWarning: string;
}

export const FINANCE_I18N: Record<FinanceLocale, FinanceCopy> = {
  ar: {
    searchPlaceholder: 'بحث بالعميل أو رقم الاشتراك…',
    all: 'الكل',
    viewDetails: 'التفاصيل',
    openCustomer: 'ملف العميل',
    noResults: 'لا توجد طلبات مطابقة',
    close: 'إغلاق',
    days: 'يوم',
    kd: 'د.ك',
    colCustomer: 'العميل',
    colSubType: 'النوع',
    colProgramBundle: 'البرنامج / الباقة',
    colRequestedAt: 'تاريخ الطلب',
    colPaid: 'المدفوع',
    colRemaining: 'أيام قابلة للاسترداد',
    colFee: 'رسوم الإلغاء',
    colNetRefund: 'صافي الاسترداد',
    colRefundMethod: 'طريقة الاسترداد',
    colStatus: 'الحالة',
    colActions: 'إجراءات',
    kpiPendingReview: 'بانتظار المراجعة',
    kpiProcessing: 'قيد التحويل',
    kpiCompletedMonth: 'مكتمل هذا الشهر',
    kpiRefundedMonth: 'إجمالي المسترجع',
    filterPendingReview: 'معلّقة',
    filterProcessing: 'قيد التحويل',
    filterCompleted: 'مكتملة',
    filterRejected: 'مرفوضة',
    filterDispute: 'نزاع',
    paginationCancellations: 'طلبات الإلغاء',
    policyTitle: 'إعدادات الإلغاء',
    policyDefaultFee: 'نسبة الإلغاء الافتراضية',
    policyDefaultFeeDesc: 'تُعرض كقيمة ابتدائية عند فتح طلب جديد — يمكن تعديلها لكل طلب.',
    policyOperationalDays: 'أيام التشغيل المخصومة',
    policyOperationalDaysDesc: 'عدد الأيام التي تُخصم قبل احتساب المبلغ المستحق.',
    policyUpdatedBy: 'آخر تحديث',
    policySave: 'حفظ الإعدادات',
    policySaved: 'تم حفظ إعدادات الإلغاء',
    cancellationDetailTitle: 'تفاصيل طلب الإلغاء',
    colSubscriptionStart: 'تاريخ الاشتراك',
    colTotalDays: 'إجمالي الأيام',
    colUsedDays: 'الأيام المستخدمة',
    colRefundableBase: 'المبلغ المستحق',
    colFeeAmount: 'قيمة رسوم الإلغاء',
    colCustomerReason: 'سبب العميل',
    colCancellationFeePct: 'نسبة الإلغاء',
    feeInputHint: 'أدخل النسبة يدوياً (0–100%) ثم احفظ',
    feeNotSet: 'لم تُحدَّد بعد',
    feeSave: 'حفظ النسبة',
    feeSaved: 'تم حفظ نسبة الإلغاء',
    previewFee: 'رسوم الإلغاء المحسوبة',
    previewNetRefund: 'صافي الاسترداد المحسوب',
    disputeNote: 'ملاحظة النزاع',
    highValueBadge: 'استرداد مرتفع',
    superAdminBadge: 'يتطلب اعتماد Super Admin',
    approveRefund: 'اعتماد الاسترداد',
    approveConfirm: 'تأكيد اعتماد الاسترداد بالمبالغ المعروضة؟',
    approveRequiresFee: 'يجب تحديد نسبة الإلغاء وحفظها قبل الاعتماد',
    rejectRefund: 'رفض الطلب',
    rejectConfirm: 'تأكيد رفض طلب الإلغاء وتوجيه العميل للدعم؟',
    completeRefund: 'تأكيد اكتمال الاسترداد',
    completeConfirm: 'تأكيد أن المبلغ وصل للعميل (محفظة/تحويل)؟',
    approvedToast: 'تم اعتماد الاسترداد',
    rejectedToast: 'تم رفض الطلب',
    completedToast: 'تم تسجيل اكتمال الاسترداد',
    zeroRefundWarning: 'لا يوجد مبلغ قابل للاسترداد بعد خصم أيام التشغيل',
  },
  en: {
    searchPlaceholder: 'Search by customer or subscription ID…',
    all: 'All',
    viewDetails: 'Details',
    openCustomer: 'Customer profile',
    noResults: 'No matching requests',
    close: 'Close',
    days: 'days',
    kd: 'KD',
    colCustomer: 'Customer',
    colSubType: 'Type',
    colProgramBundle: 'Program / Bundle',
    colRequestedAt: 'Requested',
    colPaid: 'Paid',
    colRemaining: 'Refundable days',
    colFee: 'Cancellation fee',
    colNetRefund: 'Net refund',
    colRefundMethod: 'Refund method',
    colStatus: 'Status',
    colActions: 'Actions',
    kpiPendingReview: 'Pending review',
    kpiProcessing: 'Processing payout',
    kpiCompletedMonth: 'Completed this month',
    kpiRefundedMonth: 'Total refunded',
    filterPendingReview: 'Pending',
    filterProcessing: 'Processing',
    filterCompleted: 'Completed',
    filterRejected: 'Rejected',
    filterDispute: 'Dispute',
    paginationCancellations: 'Cancellation requests',
    policyTitle: 'Cancellation settings',
    policyDefaultFee: 'Default cancellation fee',
    policyDefaultFeeDesc: 'Suggested starting value when opening a new request — editable per request.',
    policyOperationalDays: 'Operational days deducted',
    policyOperationalDaysDesc: 'Days subtracted before calculating the refundable amount.',
    policyUpdatedBy: 'Last updated by',
    policySave: 'Save settings',
    policySaved: 'Cancellation settings saved',
    cancellationDetailTitle: 'Cancellation request details',
    colSubscriptionStart: 'Subscription date',
    colTotalDays: 'Total days',
    colUsedDays: 'Used days',
    colRefundableBase: 'Refundable amount',
    colFeeAmount: 'Cancellation fee amount',
    colCustomerReason: 'Customer reason',
    colCancellationFeePct: 'Cancellation fee',
    feeInputHint: 'Enter the percentage manually (0–100%) then save',
    feeNotSet: 'Not set yet',
    feeSave: 'Save fee',
    feeSaved: 'Cancellation fee saved',
    previewFee: 'Calculated cancellation fee',
    previewNetRefund: 'Calculated net refund',
    disputeNote: 'Dispute note',
    highValueBadge: 'High-value refund',
    superAdminBadge: 'Requires Super Admin approval',
    approveRefund: 'Approve refund',
    approveConfirm: 'Approve refund with the displayed amounts?',
    approveRequiresFee: 'Set and save the cancellation fee before approving',
    rejectRefund: 'Reject request',
    rejectConfirm: 'Reject cancellation and route customer to support?',
    completeRefund: 'Mark refund complete',
    completeConfirm: 'Confirm the customer received the refund?',
    approvedToast: 'Refund approved',
    rejectedToast: 'Request rejected',
    completedToast: 'Refund marked complete',
    zeroRefundWarning: 'No refundable amount after operational day deduction',
  },
};
