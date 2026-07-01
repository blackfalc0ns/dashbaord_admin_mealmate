import { DatePipe, NgClass } from '@angular/common';
import { Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideActivity,
  lucideCalendar,
  lucideCheck,
  lucideCircleAlert,
  lucideClock,
  lucideGauge,
  lucideLayoutGrid,
  lucideListOrdered,
  lucideMapPin,
  lucideRefreshCw,
  lucideScale,
  lucideScrollText,
  lucideSearch,
  lucideSparkles,
  lucideUser,
  lucideUtensils,
  lucideWandSparkles,
  lucideX,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { AdminPageContextService } from '@/core/navigation/admin-page-context.service';
import { MmShellCardComponent } from '@/shared/components/layout/shell-card';
import { MmOperationsKpiCardComponent } from '@/shared/components/operations';
import { MmTablePaginationComponent } from '@/shared/components/layout/table-pagination';
import { createTablePagination } from '@/shared/utils/table-pagination.util';
import { OperationsStore } from '../../data/operations-store';
import {
  AutoSelectionAlert,
  AutoSelectionAuditEvent,
  AutoSelectionDistributionRow,
  AutoSelectionRow,
  AutoSelectionStatus,
} from '../../models';

type AutoSelectionFilter = 'all' | AutoSelectionStatus;
type AutoSelectionSection = 'workspace' | 'insights';
type DetailTab = 'overview' | 'audit';

@Component({
  selector: 'mm-auto-selection-workspace-page',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    NgClass,
    NgIcon,
    MmShellCardComponent,
    MmOperationsKpiCardComponent,
    MmTablePaginationComponent,
  ],
  providers: [
    provideIcons({
      lucideActivity,
      lucideCalendar,
      lucideCheck,
      lucideCircleAlert,
      lucideClock,
      lucideGauge,
      lucideLayoutGrid,
      lucideListOrdered,
      lucideMapPin,
      lucideRefreshCw,
      lucideScale,
      lucideScrollText,
      lucideSearch,
      lucideSparkles,
      lucideUser,
      lucideUtensils,
      lucideWandSparkles,
      lucideX,
    }),
  ],
  templateUrl: './auto-selection-workspace-page.component.html',
  host: { class: 'block' },
})
export class AutoSelectionWorkspacePageComponent {
  readonly locale = inject(AppLocaleService);
  readonly state = inject(OperationsStore);
  private readonly pageContext = inject(AdminPageContextService);
  private readonly destroyRef = inject(DestroyRef);

  readonly searchQuery = signal('');
  readonly activeFilter = signal<AutoSelectionFilter>('all');
  readonly activeTierFilter = signal<'all' | AutoSelectionRow['tier']>('all');
  readonly selectedSelectionId = signal<string | null>(null);
  readonly detailTab = signal<DetailTab>('overview');
  readonly overrideReason = signal('');
  readonly toast = signal<string | null>(null);
  readonly activeSection = signal<AutoSelectionSection>('workspace');
  readonly rulesModalOpen = signal(false);
  readonly pg = createTablePagination(5);
  readonly currentPage = this.pg.currentPage;
  readonly pageSize = this.pg.pageSize;

  readonly isRtl = computed(() => this.locale.isRtl());
  readonly copy = computed(() => (this.isRtl() ? AR_COPY : EN_COPY));
  readonly kpis = this.state.autoSelectionKpis;
  readonly rule = this.state.autoSelectionRule;
  readonly distribution = this.state.autoSelectionDistribution;
  readonly alerts = this.state.autoSelectionAlerts;

  readonly statusFilters: { id: AutoSelectionFilter; tone: string }[] = [
    { id: 'all', tone: 'slate' },
    { id: 'pending', tone: 'amber' },
    { id: 'completed', tone: 'emerald' },
    { id: 'fallback', tone: 'sky' },
    { id: 'quota_override', tone: 'violet' },
    { id: 'failed', tone: 'red' },
  ];

  readonly tierFilters: ('all' | AutoSelectionRow['tier'])[] = ['all', 'basic', 'platinum', 'elite'];

  readonly operationalAlerts = computed(() =>
    this.alerts().filter((a) => a.severity !== 'info'),
  );

  readonly detailTabs: DetailTab[] = ['overview', 'audit'];

  readonly rows = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const filter = this.activeFilter();
    const tier = this.activeTierFilter();
    return this.state.autoSelectionRows().filter((row) => {
      const matchesFilter = filter === 'all' || row.status === filter;
      const matchesTier = tier === 'all' || row.tier === tier;
      const matchesSearch =
        !q ||
        row.customerDisplayName.toLowerCase().includes(q) ||
        row.customerId.toLowerCase().includes(q) ||
        row.subscriptionId.toLowerCase().includes(q) ||
        row.selectedRestaurantName.toLowerCase().includes(q) ||
        row.areaName.toLowerCase().includes(q) ||
        row.programName.toLowerCase().includes(q);
      return matchesFilter && matchesTier && matchesSearch;
    });
  });

  readonly paginatedRows = this.pg.paginated(this.rows);
  readonly totalPages = this.pg.totalPages(this.rows);
  readonly paginationItems = computed(() => (this.isRtl() ? 'اختيار' : 'selections'));

  readonly selectedRow = computed(() => {
    const selected = this.selectedSelectionId();
    if (!selected) return null;
    return this.state.autoSelectionRows().find((row) => row.id === selected) ?? null;
  });

  readonly selectedAudit = computed(() => {
    const selected = this.selectedRow();
    if (!selected) return [];
    return this.state.autoSelectionAudit().filter((event) => event.selectionId === selected.id);
  });

  readonly priorityLabels = computed(() => {
    const priorities = this.copy().priorities;
    return this.rule().priorityOrder.map(
      (key) => priorities[key as keyof typeof priorities] ?? key,
    );
  });

  readonly distributionSummary = computed(() => {
    const rows = this.distribution();
    let autoTotal = 0;
    let manualTotal = 0;
    for (const row of rows) {
      autoTotal += row.autoSelectedCount;
      manualTotal += row.manualCount;
    }
    const total = autoTotal + manualTotal;
    return {
      autoTotal,
      manualTotal,
      total,
      restaurantCount: rows.length,
      autoShareOfWeek: total ? Math.round((autoTotal / total) * 100) : 0,
    };
  });

  readonly primaryMetricsLabel = computed(() =>
    this.activeSection() === 'workspace' ? this.copy().primaryMetrics : this.copy().distributionMetrics,
  );

  constructor() {
    effect(() => {
      this.pageContext.customDescription.set(this.copy().subtitle);
    });

    this.destroyRef.onDestroy(() => {
      this.pageContext.customDescription.set(null);
    });
  }

  readonly formulaExample = computed(() => {
    const row = this.selectedRow() ?? this.rows()[0];
    if (!row) return '';
    return this.limitExplanation(row);
  });

  limitExplanation(row: AutoSelectionRow): string {
    const limit = this.computeLimit(row);
    return this.isRtl()
      ? `مثال: نفس المطعم ${limit} مرات كحد أقصى خلال ${row.subscriptionDays} يوم (${row.availableRestaurants} مطاعم متاحة)`
      : `Example: same restaurant up to ${limit} times in ${row.subscriptionDays} days (${row.availableRestaurants} restaurants available)`;
  }

  auditActionLabel(action: AutoSelectionAuditEvent['action']): string {
    return this.copy().auditActions[action];
  }

  setFilter(filter: AutoSelectionFilter): void {
    this.activeFilter.set(filter);
    this.pg.resetPage();
  }

  filterChipActiveClass(id: AutoSelectionFilter): string {
    switch (id) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 shadow-sm ring-1 ring-emerald-300';
      case 'pending':
        return 'bg-amber-100 text-amber-800 shadow-sm ring-1 ring-amber-300';
      case 'fallback':
        return 'bg-sky-100 text-sky-800 shadow-sm ring-1 ring-sky-300';
      case 'quota_override':
        return 'bg-violet-100 text-violet-800 shadow-sm ring-1 ring-violet-300';
      case 'failed':
        return 'bg-rose-100 text-rose-800 shadow-sm ring-1 ring-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 shadow-sm';
    }
  }

  tierChipActiveClass(tier: 'all' | AutoSelectionRow['tier']): string {
    switch (tier) {
      case 'basic':
        return 'bg-slate-200 text-slate-800 shadow-sm ring-1 ring-slate-300';
      case 'platinum':
        return 'bg-indigo-100 text-indigo-800 shadow-sm ring-1 ring-indigo-300';
      case 'elite':
        return 'bg-amber-100 text-amber-800 shadow-sm ring-1 ring-amber-300';
      default:
        return 'bg-slate-100 text-slate-800 shadow-sm';
    }
  }

  setTierFilter(tier: 'all' | AutoSelectionRow['tier']): void {
    this.activeTierFilter.set(tier);
    this.pg.resetPage();
  }

  setDetailTab(tab: DetailTab): void {
    this.detailTab.set(tab);
  }

  setSection(section: AutoSelectionSection): void {
    this.activeSection.set(section);
  }

  sectionNavClass(section: AutoSelectionSection): string {
    const base =
      'flex w-full min-h-8 min-w-0 items-center justify-center gap-1.5 rounded-lg border border-transparent px-2 py-1.5 text-[0.6875rem] font-bold leading-snug whitespace-nowrap transition-[color,background,box-shadow,border-color] duration-150';
    if (this.activeSection() === section) {
      return `${base} border-emerald-200/70 bg-white text-emerald-700 shadow-[0_1px_2px_rgba(15,29,50,0.05),inset_0_0_0_1px_rgba(255,255,255,0.85)]`;
    }
    return `${base} text-slate-500 hover:bg-white/55 hover:text-slate-700`;
  }

  sectionIconClass(section: AutoSelectionSection): string {
    return this.activeSection() === section ? 'text-emerald-600' : 'text-slate-400';
  }

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
    this.pg.resetPage();
  }

  onPageChange(page: number): void {
    this.pg.onPageChange(page, this.totalPages());
  }

  select(row: AutoSelectionRow): void {
    this.selectedSelectionId.set(row.id);
    this.overrideReason.set('');
    this.detailTab.set('overview');
  }

  closeDetailModal(): void {
    this.selectedSelectionId.set(null);
    this.overrideReason.set('');
    this.detailTab.set('overview');
  }

  openRulesModal(): void {
    this.rulesModalOpen.set(true);
  }

  closeRulesModal(): void {
    this.rulesModalOpen.set(false);
  }

  statusLabel(status: AutoSelectionStatus | 'all'): string {
    return this.copy().statuses[status];
  }

  statusClass(status: AutoSelectionStatus): string {
    return (
      {
        pending: 'bg-amber-50 text-amber-700 ring-amber-100',
        completed: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
        fallback: 'bg-sky-50 text-sky-700 ring-sky-100',
        quota_override: 'bg-violet-50 text-violet-700 ring-violet-100',
        failed: 'bg-red-50 text-red-700 ring-red-100',
      } satisfies Record<AutoSelectionStatus, string>
    )[status];
  }

  sourceLabel(source: AutoSelectionRow['source']): string {
    return this.copy().sources[source];
  }

  tierLabel(tier: AutoSelectionRow['tier']): string {
    return this.copy().tiers[tier];
  }

  tierClass(tier: AutoSelectionRow['tier']): string {
    return (
      {
        basic: 'bg-slate-100 text-slate-700 ring-slate-200',
        platinum: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
        elite: 'bg-amber-50 text-amber-800 ring-amber-100',
      } satisfies Record<AutoSelectionRow['tier'], string>
    )[tier];
  }

  computeLimit(row: AutoSelectionRow): number {
    return Math.max(Math.ceil(row.availableRestaurants / row.subscriptionDays), 2);
  }

  subscriptionProgress(row: AutoSelectionRow): number {
    if (!row.subscriptionDays) return 0;
    return Math.round((row.dayNumber / row.subscriptionDays) * 100);
  }

  lockProgress(hours: number | null): number {
    if (hours === null) return 100;
    return Math.max(0, Math.min(100, Math.round(((72 - hours) / 72) * 100)));
  }

  distributionMix(row: AutoSelectionDistributionRow): { auto: number; manual: number } {
    const total = row.autoSelectedCount + row.manualCount;
    if (!total) return { auto: 0, manual: 0 };
    return {
      auto: Math.round((row.autoSelectedCount / total) * 100),
      manual: Math.round((row.manualCount / total) * 100),
    };
  }

  isTopDistributionShare(row: AutoSelectionDistributionRow): boolean {
    const rows = this.distribution();
    if (rows.length < 2) return false;
    const max = Math.max(...rows.map((item) => item.sharePercent));
    return row.sharePercent === max;
  }

  alertTitle(alert: AutoSelectionAlert): string {
    return this.isRtl() ? alert.titleAr : alert.titleEn;
  }

  alertDetail(alert: AutoSelectionAlert): string {
    return this.isRtl() ? alert.detailAr : alert.detailEn;
  }

  alertClass(severity: AutoSelectionAlert['severity']): string {
    return (
      {
        info: 'border-sky-100 bg-sky-50/80',
        warning: 'border-amber-100 bg-amber-50/80',
        critical: 'border-red-100 bg-red-50/80',
      } satisfies Record<AutoSelectionAlert['severity'], string>
    )[severity];
  }

  alertIconClass(severity: AutoSelectionAlert['severity']): string {
    return (
      {
        info: 'text-sky-600',
        warning: 'text-amber-600',
        critical: 'text-red-600',
      } satisfies Record<AutoSelectionAlert['severity'], string>
    )[severity];
  }

  detailTabLabel(tab: DetailTab): string {
    return this.copy().detailTabs[tab];
  }

  toggleRule(): void {
    this.state.toggleAutoSelectionEnabled();
    const enabled = this.rule().enabled;
    this.toast.set(enabled ? this.copy().ruleEnabledToast : this.copy().ruleDisabledToast);
    setTimeout(() => this.toast.set(null), 2500);
  }

  applyOverride(): void {
    const selected = this.selectedRow();
    const reason = this.overrideReason().trim();
    if (!selected || !reason) return;

    this.state.applyManualOverride(selected.id, reason);
    this.toast.set(this.copy().overrideToast);
    setTimeout(() => this.toast.set(null), 2500);
  }

  canOverride(row: AutoSelectionRow | null): boolean {
    return !!row && (row.status === 'failed' || row.status === 'pending');
  }
}

const EN_COPY = {
  title: 'Auto selection',
  subtitle: 'Automatic meal assignment when the customer has not chosen before the 72-hour deadline.',
  primaryMetrics: 'Today overview',
  distributionMetrics: 'Distribution overview',
  sectionsLabel: 'Page sections',
  sectionWorkspace: 'Workspace',
  sectionInsights: 'Distribution',
  workspace: 'Workspace',
  close: 'Close',
  viewRules: 'View active rules',
  rulesModalSubtitle: 'Selection logic, limits, and safeguards currently in effect.',
  detailModalTitle: 'Selection details',
  detailModalSubtitle: 'Review the chosen meal, applied checks, and activity log.',
  keyData: 'Key information',
  deliveryInfo: 'Delivery',
  progress: 'Progress',
  insightsSection: 'Rules & distribution',
  filterStatus: 'Status',
  filterTier: 'Tier',
  selectRowHint: 'Select a customer from the list to view selection details and activity log.',
  search: 'Search by customer, program, area, or restaurant...',
  totalRuns: 'Total runs',
  completed: 'Completed',
  pending72h: 'Awaiting 72h',
  fallbackRuns: 'Fallback',
  failedRuns: 'Failed',
  successRate: 'Success rate',
  totalDesc: 'Auto-selection events today',
  completedDesc: 'Completed automatically',
  pendingDesc: 'Customer has not chosen yet',
  fallbackDesc: 'Temporary limit relief',
  failedDesc: 'Blocked or incomplete profile',
  successDesc: 'Without fallback',
  alerts: 'Needs attention',
  rulePanel: 'Active rules',
  rulePanelDesc: 'How automatic selection works and which safeguards apply.',
  ruleEnabled: 'Active',
  ruleDisabled: 'Paused',
  ruleVersion: 'Rule version',
  priorityOrder: 'Selection priority',
  priorityOrderDesc: 'Applied in this order when assigning a restaurant.',
  trigger: 'When it runs',
  triggerValue: '72 hours before delivery if the customer did not choose',
  limitFormula: 'Restaurant repetition limit',
  limitRuleSummary: 'The system limits how often the same restaurant repeats during the subscription. Minimum allowed repetitions is 2.',
  formulaExample: 'Applied example',
  fallback: 'Fallback when no match',
  busyOverride: 'Override when all restaurants are busy',
  enabled: 'Enabled',
  disabled: 'Disabled',
  toggleRule: 'Pause / resume',
  distribution: 'Restaurant distribution',
  distributionDesc: 'Auto vs manual selection share per restaurant this week',
  totalThisWeek: 'Total this week',
  totalWeekDesc: 'Selections assigned this week',
  autoWeekDesc: 'Auto-selected meals',
  manualWeekDesc: 'Customer manual picks',
  autoShareWeekDesc: 'Share of auto selections',
  restaurantsDesc: 'Restaurants tracked',
  restaurantsTracked: 'Restaurants',
  autoShareOfWeek: 'Auto share',
  leaderShare: 'Top share',
  distRestaurant: 'Restaurant',
  distShare: 'Share',
  distMix: 'Auto / manual',
  autoShare: 'Auto',
  manualShare: 'Manual',
  selections: 'Pending & recent selections',
  result: 'Meal chosen',
  customer: 'Customer',
  deliveryDate: 'Delivery',
  program: 'Program',
  area: 'Area',
  tier: 'Tier',
  restaurant: 'Selection',
  status: 'Status',
  day: 'Day',
  noRows: 'No records match your filters.',
  constraints: 'Checks applied',
  allergies: 'Allergies respected',
  dislikes: 'Dislikes respected',
  capacity: 'Capacity available',
  notification: 'Customer notified',
  hoursUntilLock: 'Time until auto-selection',
  lockAt: 'Auto-selection at',
  selectionReason: 'Why this was chosen',
  fallbackReason: 'Why fallback was used',
  auditTrail: 'Activity log',
  manualOverride: 'Manual intervention',
  overridePlaceholder: 'Describe the reason — this will be saved in the activity log.',
  applyOverride: 'Save intervention',
  ruleEnabledToast: 'Auto-selection is now active.',
  ruleDisabledToast: 'Auto-selection is paused.',
  overrideToast: 'Intervention saved.',
  subscriptionDays: 'Day in subscription',
  selectedMeal: 'Chosen meal',
  rejectedCandidates: 'Restaurants not selected',
  customerPrefs: 'Customer restrictions',
  noAllergies: 'No allergies on file',
  noDislikes: 'No dislikes on file',
  noCandidates: 'No rejected restaurants',
  noAuditEvents: 'No activity recorded yet.',
  detailTabs: {
    overview: 'Details',
    audit: 'Activity',
  },
  auditActions: {
    AutoSelect: 'Automatic selection',
    Fallback: 'Fallback selection',
    QuotaOverride: 'Busy override',
    ManualOverride: 'Manual intervention',
    Failed: 'Selection blocked',
  },
  statuses: {
    all: 'All',
    pending: 'Awaiting choice',
    completed: 'Completed',
    fallback: 'Fallback',
    quota_override: 'Busy override',
    failed: 'Blocked',
  },
  sources: {
    automatic: 'Automatic',
    fallback: 'Fallback',
    manual_override: 'Manual',
  },
  tiers: {
    all: 'All tiers',
    basic: 'Basic',
    platinum: 'Platinum',
    elite: 'Elite',
  },
  priorities: {
    allergies: 'Allergies',
    dislikes: 'Dislikes',
    tier_access: 'Tier access',
    capacity: 'Capacity',
    repetition_limit: 'Repetition limit',
    fair_distribution: 'Fair distribution',
  },
};

const AR_COPY: typeof EN_COPY = {
  title: 'الاختيار التلقائي',
  subtitle: 'تعيين الوجبة تلقائيًا عندما لا يختار العميل قبل مهلة 72 ساعة.',
  primaryMetrics: 'ملخص اليوم',
  distributionMetrics: 'ملخص التوزيع',
  sectionsLabel: 'أقسام الصفحة',
  sectionWorkspace: 'مساحة العمل',
  sectionInsights: 'التوزيع',
  workspace: 'مساحة العمل',
  close: 'إغلاق',
  viewRules: 'عرض القواعد النشطة',
  rulesModalSubtitle: 'منطق الاختيار والحدود والضمانات المطبقة حاليًا.',
  detailModalTitle: 'تفاصيل الاختيار',
  detailModalSubtitle: 'مراجعة الوجبة المختارة والفحوصات المطبقة وسجل النشاط.',
  keyData: 'المعلومات الأساسية',
  deliveryInfo: 'التسليم',
  progress: 'التقدم',
  insightsSection: 'القواعد والتوزيع',
  filterStatus: 'الحالة',
  filterTier: 'التصنيف',
  selectRowHint: 'اختر عميلًا من القائمة لعرض تفاصيل الاختيار وسجل النشاط.',
  search: 'ابحث بالعميل أو البرنامج أو المنطقة أو المطعم...',
  totalRuns: 'إجمالي التشغيل',
  completed: 'مكتمل',
  pending72h: 'بانتظار 72h',
  fallbackRuns: 'Fallback',
  failedRuns: 'محجوب',
  successRate: 'معدل النجاح',
  totalDesc: 'عمليات الاختيار اليوم',
  completedDesc: 'اكتملت تلقائيًا',
  pendingDesc: 'العميل لم يختر بعد',
  fallbackDesc: 'فتح مؤقت للحد',
  failedDesc: 'ملف ناقص أو محجوب',
  successDesc: 'بدون fallback',
  alerts: 'يتطلب انتباه',
  rulePanel: 'القواعد النشطة',
  rulePanelDesc: 'كيف يعمل الاختيار التلقائي والضمانات المطبقة عليه.',
  ruleEnabled: 'نشط',
  ruleDisabled: 'متوقف',
  ruleVersion: 'إصدار القاعدة',
  priorityOrder: 'أولوية الاختيار',
  priorityOrderDesc: 'يُطبَّق بهذا الترتيب عند تعيين المطعم.',
  trigger: 'متى يعمل',
  triggerValue: 'قبل 72 ساعة من التسليم إذا لم يختر العميل',
  limitFormula: 'حد تكرار المطعم',
  limitRuleSummary: 'النظام يحدّ كم مرة يتكرر نفس المطعم خلال الاشتراك. الحد الأدنى المسموح مرتين.',
  formulaExample: 'مثال مطبّق',
  fallback: 'Fallback عند عدم التطابق',
  busyOverride: 'تجاوز عند انشغال كل المطاعم',
  enabled: 'مفعّل',
  disabled: 'متوقف',
  toggleRule: 'إيقاف / تفعيل',
  distribution: 'توزيع المطاعم',
  distributionDesc: 'نسبة الاختيارات التلقائية واليدوية لكل مطعم هذا الأسبوع',
  totalThisWeek: 'إجمالي هذا الأسبوع',
  totalWeekDesc: 'الاختيارات المسجّلة هذا الأسبوع',
  autoWeekDesc: 'وجبات اختيرت تلقائيًا',
  manualWeekDesc: 'اختيارات يدوية من العميل',
  autoShareWeekDesc: 'نسبة الاختيار التلقائي',
  restaurantsDesc: 'مطاعم ضمن التوزيع',
  restaurantsTracked: 'المطاعم',
  autoShareOfWeek: 'حصة التلقائي',
  leaderShare: 'أعلى حصة',
  distRestaurant: 'المطعم',
  distShare: 'الحصة',
  distMix: 'تلقائي / يدوي',
  autoShare: 'تلقائي',
  manualShare: 'يدوي',
  selections: 'الاختيارات الحالية',
  result: 'الوجبة',
  customer: 'العميل',
  deliveryDate: 'التسليم',
  program: 'البرنامج',
  area: 'المنطقة',
  tier: 'التصنيف',
  restaurant: 'الاختيار',
  status: 'الحالة',
  day: 'اليوم',
  noRows: 'لا توجد سجلات مطابقة.',
  constraints: 'الفحوصات المطبقة',
  allergies: 'احترام الحساسية',
  dislikes: 'احترام عدم الإعجاب',
  capacity: 'طاقة متاحة',
  notification: 'تم إشعار العميل',
  hoursUntilLock: 'الوقت المتبقي للاختيار التلقائي',
  lockAt: 'موعد الاختيار التلقائي',
  selectionReason: 'سبب الاختيار',
  fallbackReason: 'سبب استخدام Fallback',
  auditTrail: 'سجل النشاط',
  manualOverride: 'تدخل يدوي',
  overridePlaceholder: 'اكتب سبب التدخل — سيُحفظ في سجل النشاط.',
  applyOverride: 'حفظ التدخل',
  ruleEnabledToast: 'تم تفعيل الاختيار التلقائي.',
  ruleDisabledToast: 'تم إيقاف الاختيار التلقائي.',
  overrideToast: 'تم حفظ التدخل.',
  subscriptionDays: 'اليوم في الاشتراك',
  selectedMeal: 'الوجبة المختارة',
  rejectedCandidates: 'مطاعم لم تُختار',
  customerPrefs: 'قيود العميل',
  noAllergies: 'لا توجد حساسية مسجلة',
  noDislikes: 'لا يوجد عدم إعجاب',
  noCandidates: 'لا توجد مطاعم مرفوضة',
  noAuditEvents: 'لا يوجد نشاط مسجّل بعد.',
  detailTabs: { overview: 'التفاصيل', audit: 'النشاط' },
  auditActions: {
    AutoSelect: 'اختيار تلقائي',
    Fallback: 'اختيار Fallback',
    QuotaOverride: 'تجاوز عند الانشغال',
    ManualOverride: 'تدخل يدوي',
    Failed: 'تعذّر الاختيار',
  },
  statuses: {
    all: 'الكل',
    pending: 'بانتظار الاختيار',
    completed: 'مكتمل',
    fallback: 'Fallback',
    quota_override: 'تجاوز مؤقت',
    failed: 'محجوب',
  },
  sources: { automatic: 'تلقائي', fallback: 'Fallback', manual_override: 'يدوي' },
  tiers: { all: 'كل التصنيفات', basic: 'Basic', platinum: 'Platinum', elite: 'Elite' },
  priorities: {
    allergies: 'الحساسية',
    dislikes: 'عدم الإعجاب',
    tier_access: 'نطاق التصنيف',
    capacity: 'الطاقة',
    repetition_limit: 'حد التكرار',
    fair_distribution: 'التوزيع العادل',
  },
};
