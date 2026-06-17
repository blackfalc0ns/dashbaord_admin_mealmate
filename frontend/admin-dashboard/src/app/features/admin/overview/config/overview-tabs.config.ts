import type { OverviewTabId } from '../models/overview.model';

export type { OverviewTabId };

export interface OverviewTabDefinition {
  id: OverviewTabId;
  labelAr: string;
  labelEn: string;
  introAr: string;
  introEn: string;
  highlightsAr: string[];
  highlightsEn: string[];
  icon: string;
}

export const OVERVIEW_TABS: OverviewTabDefinition[] = [
  {
    id: 'summary',
    labelAr: 'ملخص اليوم',
    labelEn: 'Daily summary',
    icon: 'lucideLayoutDashboard',
    introAr:
      'نظرة سريعة على أهم مؤشرات المنصة اليوم: اشتراكات، طلبات، إيراد، وعناصر تحتاج متابعة. استخدم الاختصارات للانتقال المباشر.',
    introEn:
      'A quick snapshot of today’s platform KPIs: subscriptions, orders, revenue, and items needing attention. Use quick links to jump in.',
    highlightsAr: [
      '8 مؤشرات رئيسية مع اتجاه التغيّر عن الفترة السابقة',
      'اختصارات لأكثر الأقسام استخداماً',
      'معاينة التنبيهات الحرجة',
    ],
    highlightsEn: [
      '8 key metrics with period-over-period trend',
      'Shortcuts to the most-used sections',
      'Preview of critical alerts',
    ],
  },
  {
    id: 'analytics',
    labelAr: 'التحليلات',
    labelEn: 'Analytics',
    icon: 'lucideChartArea',
    introAr:
      'رسوم بيانية تفصيلية لاتجاه الطلبات، الإيراد والاسترداد، توزيع الاشتراكات، ومسار الطلب من الجدولة حتى التسليم.',
    introEn:
      'Detailed charts for order trends, revenue vs refunds, subscription mix, and the order pipeline from scheduling to delivery.',
    highlightsAr: [
      'اتجاه الطلبات: مؤكدة / مسلّمة / ملغاة',
      'الإيراد مقابل الاسترداد ورسوم الإلغاء',
      'توزيع الاشتراكات ومسار الطلب التشغيلي',
    ],
    highlightsEn: [
      'Order trend: confirmed / delivered / cancelled',
      'Revenue vs refunds and cancellation fees',
      'Subscription mix and operational pipeline',
    ],
  },
  {
    id: 'operations',
    labelAr: 'العمليات',
    labelEn: 'Operations',
    icon: 'lucideClock',
    introAr:
      'متابعة التشغيل اليومي: نافذة 72 ساعة، تأكيد المطاعم، نوافذ البديل، التحضير 24 ساعة، التتبع المباشر، وحالات Hold.',
    introEn:
      'Daily operations: 72h window, restaurant confirmation, replacement windows, 24h prep, live tracking, and Hold cases.',
    highlightsAr: [
      '24 طلباً في نافذة 72h — 3 تأخر تأكيد',
      'مراقبة نوافذ بديل العميل (24h)',
      '6 حالات Hold تحتاج متابعة',
    ],
    highlightsEn: [
      '24 orders in 72h window — 3 confirmation overdue',
      'Customer replacement windows (24h)',
      '6 Hold cases need follow-up',
    ],
  },
  {
    id: 'accounts',
    labelAr: 'الحسابات',
    labelEn: 'Accounts',
    icon: 'lucideUsers',
    introAr:
      'اعتماد المطاعم والسائقين، حالة الحسابات النشطة، وطلبات التسجيل المعلّقة قبل دخولهم المنصة.',
    introEn:
      'Restaurant and driver approvals, active account status, and pending registration requests before platform access.',
    highlightsAr: [
      '12 مطعماً و4 سائقين قيد المراجعة',
      '86 مطعماً نشطاً على المنصة',
      'كل اعتماد/رفض يُسجّل في سجل التدقيق',
    ],
    highlightsEn: [
      '12 restaurants and 4 drivers pending review',
      '86 active restaurants on the platform',
      'Every approve/reject is audit-logged',
    ],
  },
  {
    id: 'subscriptions',
    labelAr: 'الاشتراكات',
    labelEn: 'Subscriptions',
    icon: 'lucideTags',
    introAr:
      'توزيع الاشتراكات حسب التصنيف (Basic / Platinum / Elite)، البرامج والباقات، وإنذارات الربحية المبكرة.',
    introEn:
      'Subscription distribution by tier (Basic / Platinum / Elite), programs and bundles, and early profitability warnings.',
    highlightsAr: [
      '1,842 اشتراكاً نشطاً',
      'إنذار ربحية: برنامج «تنشيف» أقل من 10%',
      'التصنيف يُحدَّث عند تغيّر أسعار المطاعم',
    ],
    highlightsEn: [
      '1,842 active subscriptions',
      'Profitability alert: "Cutting" program below 10%',
      'Tiers recalculate when restaurant prices change',
    ],
  },
  {
    id: 'finance',
    labelAr: 'المالية',
    labelEn: 'Finance',
    icon: 'lucideWallet',
    introAr:
      'الإيراد، الإلغاءات والاسترداد، تسويات المطاعm، وعمولة المنصة — مع فصل واضح عن عمولة المطاعm الداخلية.',
    introEn:
      'Revenue, cancellations and refunds, restaurant settlements, and platform commission — separate from internal restaurant commission.',
    highlightsAr: [
      '5 إلغاءات معلّقة بانتظار المراجعة',
      '14 تسوية قيد المراجعة',
      'عمولة المنصة: 15%–30% حسب مدة الاشتراك',
    ],
    highlightsEn: [
      '5 pending cancellations awaiting review',
      '14 settlements under review',
      'Platform commission: 15%–30% by subscription length',
    ],
  },
  {
    id: 'support',
    labelAr: 'الدعم والإعدادات',
    labelEn: 'Support & settings',
    icon: 'lucideLifeBuoy',
    introAr:
      'شكاوى العملاء، تعديلات المحفظة، مناطق الخدمة والتغطية، والإعدادات العامة للمنصة.',
    introEn:
      'Customer complaints, wallet adjustments, service areas and coverage, and global platform settings.',
    highlightsAr: [
      '8 شكاوى مفتوحة',
      '24 منطقة نشطة — تغطية 78%',
      '3 تعديلات محفظة هذا الأسبوع',
    ],
    highlightsEn: [
      '8 open complaints',
      '24 active areas — 78% coverage',
      '3 wallet adjustments this week',
    ],
  },
  {
    id: 'alerts',
    labelAr: 'التنبيهات',
    labelEn: 'Alerts',
    icon: 'lucideBell',
    introAr:
      'التنبيهات الحرجة التي تحتاج تدخلاً فورياً، وسجل آخر الإجراءات على المنصة مع روابط مباشرة للمعالجة.',
    introEn:
      'Critical alerts needing immediate action, and a log of recent platform events with direct links to resolve them.',
    highlightsAr: [
      '3 تنبيهات حرجة نشطة',
      'سجل نشاط: اعتمادات، استثناءات، تسويات',
      'كل عنصر قابل للنقر للانتقال للصفحة المعنية',
    ],
    highlightsEn: [
      '3 active critical alerts',
      'Activity log: approvals, exceptions, settlements',
      'Every item links to the relevant page',
    ],
  },
];

export const DEFAULT_OVERVIEW_TAB: OverviewTabId = 'summary';

export const ANALYTICS_CHART_IDS = [
  'orders-trend',
  'delivery-sla',
  'order-pipeline',
  'revenue-breakdown',
  'program-revenue',
  'commission-trend',
  'subscriptions-donut',
  'subscription-tiers',
  'customer-retention',
  'restaurant-orders',
] as const;

export const FINANCE_CHART_IDS = [
  'revenue-breakdown',
  'commission-trend',
  'program-revenue',
  'refund-analysis',
  'settlement-pipeline',
] as const;

export const SUPPORT_CHART_IDS = [
  'complaints-trend',
  'resolution-sla',
  'complaint-types',
  'service-coverage',
] as const;

export const ALERTS_CHART_IDS = [
  'alerts-trend',
  'alert-categories',
] as const;

export const SUBSCRIPTIONS_CHART_IDS = [
  'subscriptions-donut',
  'customer-retention',
  'subscription-tiers',
  'program-profitability',
  'subscription-duration',
] as const;

export const ACCOUNTS_CHART_IDS = [
  'account-registrations',
  'active-accounts-trend',
  'pending-breakdown',
  'approval-time',
  'document-pipeline',
] as const;

export const OPERATIONS_CHART_IDS = [
  'orders-trend',
  'delivery-sla',
  'order-pipeline',
  'confirmation-windows',
  'delivery-load',
] as const;

export function isOverviewTabId(value: string | null | undefined): value is OverviewTabId {
  return OVERVIEW_TABS.some((tab) => tab.id === value);
}
