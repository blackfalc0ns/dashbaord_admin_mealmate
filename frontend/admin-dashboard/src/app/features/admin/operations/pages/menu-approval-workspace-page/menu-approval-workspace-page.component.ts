import { DatePipe, NgClass } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArchive,
  lucideBadgeCheck,
  lucideCalendarClock,
  lucideCalendar,
  lucideCheck,
  lucideCircleAlert,
  lucideClipboardCheck,
  lucideFileText,
  lucideFlame,
  lucideGitCompare,
  lucideInfo,
  lucideLanguages,
  lucidePlus,
  lucideScrollText,
  lucideSearch,
  lucideShieldCheck,
  lucideTag,
  lucideUser,
  lucideUtensils,
  lucideWheat,
  lucideX,
} from '@ng-icons/lucide';

import { AdminPermissions } from '@/core/auth/admin-permissions';
import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { MmTablePaginationComponent } from '@/shared/components/layout/table-pagination';
import { MmOperationsKpiCardComponent } from '@/shared/components/operations';
import { HasPermissionDirective } from '@/shared/directives/has-permission.directive';
import { createTablePagination } from '@/shared/utils/table-pagination.util';
import { OperationsStore } from '../../data/operations-store';
import {
  MenuApprovalRequest,
  MenuApprovalRequestType,
  MenuApprovalStatus,
  RestaurantMenuReadiness,
} from '../../models';

type MenuApprovalFilter =
  | 'all'
  | MenuApprovalStatus
  | MenuApprovalRequestType
  | 'blocked'
  | 'label_ready'
  | 'restaurant_not_ready';

type MenuDetailTab = 'overview' | 'meal' | 'impact' | 'audit';

interface MenuDataCheck {
  label: string;
  ok: boolean;
}

interface MenuComparisonRow {
  label: string;
  before: string;
  after: string;
  changed: boolean;
}

const MENU_COPY = {
  ar: {
    title: 'اعتماد القوائم والوجبات',
    subtitle: 'مراجعة إضافات وتعديلات وإلغاء الوجبات قبل ظهورها للعملاء.',
    createRequest: 'طلب مراجعة جديد',
    search: 'ابحث بالمطعم أو الوجبة أو رقم الطلب...',
    all: 'الكل',
    pending: 'معلق',
    inReview: 'قيد المراجعة',
    approved: 'معتمد',
    rejected: 'مرفوض',
    changesRequested: 'استكمال مطلوب',
    cancellationApproved: 'إلغاء معتمد',
    archived: 'مؤرشف',
    blocked: 'بيانات ناقصة',
    labelReady: 'جاهز للملصق',
    restaurantNotReady: 'مطعم غير جاهز',
    pendingKpi: 'طلبات معلقة',
    translationKpi: 'مشاكل ترجمة',
    nutritionKpi: 'نقص تغذية/حساسية',
    cancellationKpi: 'طلبات إلغاء',
    readinessKpi: 'مطاعم غير جاهزة',
    labelKpi: 'جاهزية الملصقات',
    requests: 'طلبات الاعتماد',
    request: 'طلب',
    restaurant: 'المطعم',
    meal: 'الوجبة',
    type: 'النوع',
    status: 'الحالة',
    price: 'السعر',
    updated: 'آخر تحديث',
    details: 'تفاصيل الطلب',
    tabOverview: 'نظرة عامة',
    tabMeal: 'الوجبة',
    tabImpact: 'الأثر',
    tabAudit: 'السجل',
    keyData: 'بيانات الطلب',
    requestInfo: 'معلومات الطلب',
    submittedAt: 'تاريخ الإرسال',
    lastUpdated: 'آخر تحديث',
    requestReason: 'سبب الطلب',
    submittedBy: 'مقدّم الطلب',
    mealId: 'معرّف الوجبة',
    restaurantId: 'معرّف المطعم',
    version: 'إصدار السجل',
    bilingualNames: 'الاسم والوصف باللغتين',
    nameAr: 'الاسم بالعربية',
    nameEn: 'الاسم بالإنجليزية',
    descriptionAr: 'الوصف بالعربية',
    descriptionEn: 'الوصف بالإنجليزية',
    comparison: 'مقارنة التعديل',
    previousValue: 'قبل',
    newValue: 'بعد',
    field: 'الحقل',
    sodium: 'الصوديوم',
    dataChecklist: 'جاهزية البيانات',
    complete: 'مكتمل',
    incomplete: 'ناقص',
    noReason: 'لم يُذكر سبب.',
    calories: 'السعرات',
    protein: 'البروتين',
    carbs: 'الكربوهيدرات',
    fat: 'الدهون',
    preview: 'معاينة الوجبة',
    nutrition: 'التغذية',
    ingredients: 'المكونات',
    allergens: 'الحساسية',
    programs: 'البرامج',
    bundles: 'الباقات',
    activeImpact: 'أثر الاشتراكات النشطة',
    activeSubscriptions: 'اشتراكات نشطة',
    futureSelections: 'اختيارات مستقبلية',
    noRetroactive: 'تعديل السعر لا يطبق بأثر رجعي على الاختيارات السابقة.',
    cancellationPolicy: 'بعد الاعتماد تختفي عن العملاء الجدد وتبقى للاختيارات القائمة 30 يومًا.',
    effectiveAt: 'تاريخ السريان',
    blockers: 'نواقص الاعتماد',
    audit: 'سجل التدقيق',
    readiness: 'جاهزية المطعم',
    noRows: 'لا توجد طلبات مطابقة.',
    selectRequest: 'اختر طلبًا لعرض التفاصيل.',
    startReview: 'بدء المراجعة',
    approve: 'اعتماد',
    approveCancellation: 'اعتماد الإلغاء',
    requestChanges: 'طلب استكمال',
    reject: 'رفض',
    archive: 'أرشفة',
    close: 'إغلاق',
    newMeal: 'وجبة جديدة',
    mealUpdate: 'تعديل وجبة',
    cancelMeal: 'إلغاء وجبة',
    breakfast: 'فطور',
    lunch: 'غداء',
    dinner: 'عشاء',
    snack: 'سناك',
    salad: 'سلطة',
    missingTranslation: 'الاسم أو الوصف غير مكتمل باللغتين',
    missingNutrition: 'السعرات أو الماكروز غير مكتملة',
    missingAllergens: 'الحساسية غير محددة',
    missingPrice: 'السعر غير محدد',
    ready: 'جاهز',
    needsMenu: 'ينقصه منيو',
    needsPricing: 'ينقصه تسعير',
    needsLabels: 'ينقصه ملصقات',
    toastCreated: 'تم إنشاء طلب مراجعة محلي.',
    toastReview: 'تم بدء المراجعة.',
    toastApproved: 'تم اعتماد الطلب.',
    toastBlocked: 'لا يمكن الاعتماد قبل استكمال البيانات.',
    toastChanges: 'تم طلب استكمال البيانات.',
    toastRejected: 'تم رفض الطلب.',
    toastArchived: 'تمت الأرشفة.',
    paginationItems: 'طلب',
    kwd: 'د.ك',
  },
  en: {
    title: 'Menu & Meal Approval',
    subtitle: 'Review meal additions, updates, and cancellation requests before customer visibility.',
    createRequest: 'New review request',
    search: 'Search restaurant, meal, or request ID...',
    all: 'All',
    pending: 'Pending',
    inReview: 'In review',
    approved: 'Approved',
    rejected: 'Rejected',
    changesRequested: 'Changes requested',
    cancellationApproved: 'Cancellation approved',
    archived: 'Archived',
    blocked: 'Missing data',
    labelReady: 'Label ready',
    restaurantNotReady: 'Restaurant not ready',
    pendingKpi: 'Pending requests',
    translationKpi: 'Translation issues',
    nutritionKpi: 'Nutrition/allergy gaps',
    cancellationKpi: 'Cancellation requests',
    readinessKpi: 'Not-ready restaurants',
    labelKpi: 'Label readiness',
    requests: 'Approval requests',
    request: 'request',
    restaurant: 'Restaurant',
    meal: 'Meal',
    type: 'Type',
    status: 'Status',
    price: 'Price',
    updated: 'Updated',
    details: 'Request details',
    tabOverview: 'Overview',
    tabMeal: 'Meal',
    tabImpact: 'Impact',
    tabAudit: 'Audit',
    keyData: 'Request data',
    requestInfo: 'Request information',
    submittedAt: 'Submitted',
    lastUpdated: 'Last updated',
    requestReason: 'Request reason',
    submittedBy: 'Submitted by',
    mealId: 'Meal ID',
    restaurantId: 'Restaurant ID',
    version: 'Record version',
    bilingualNames: 'Bilingual name & description',
    nameAr: 'Arabic name',
    nameEn: 'English name',
    descriptionAr: 'Arabic description',
    descriptionEn: 'English description',
    comparison: 'Change comparison',
    previousValue: 'Before',
    newValue: 'After',
    field: 'Field',
    sodium: 'Sodium',
    dataChecklist: 'Data readiness',
    complete: 'Complete',
    incomplete: 'Incomplete',
    noReason: 'No reason provided.',
    calories: 'Calories',
    protein: 'Protein',
    carbs: 'Carbs',
    fat: 'Fat',
    preview: 'Meal preview',
    nutrition: 'Nutrition',
    ingredients: 'Ingredients',
    allergens: 'Allergens',
    programs: 'Programs',
    bundles: 'Bundles',
    activeImpact: 'Active subscription impact',
    activeSubscriptions: 'Active subscriptions',
    futureSelections: 'Future selections',
    noRetroactive: 'Price updates do not apply retroactively to previous selections.',
    cancellationPolicy: 'After approval, hidden from new customers while existing selections remain for 30 days.',
    effectiveAt: 'Effective at',
    blockers: 'Approval gaps',
    audit: 'Audit trail',
    readiness: 'Restaurant readiness',
    noRows: 'No requests match this filter.',
    selectRequest: 'Select a request to view details.',
    startReview: 'Start review',
    approve: 'Approve',
    approveCancellation: 'Approve cancellation',
    requestChanges: 'Request changes',
    reject: 'Reject',
    archive: 'Archive',
    close: 'Close',
    newMeal: 'New meal',
    mealUpdate: 'Meal update',
    cancelMeal: 'Cancel meal',
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snack: 'Snack',
    salad: 'Salad',
    missingTranslation: 'Name or description is incomplete in both languages',
    missingNutrition: 'Calories or macros are incomplete',
    missingAllergens: 'Allergy data is not set',
    missingPrice: 'Price is not set',
    ready: 'Ready',
    needsMenu: 'Needs menu',
    needsPricing: 'Needs pricing',
    needsLabels: 'Needs labels',
    toastCreated: 'Local review request created.',
    toastReview: 'Review started.',
    toastApproved: 'Request approved.',
    toastBlocked: 'Complete required data before approval.',
    toastChanges: 'Changes requested.',
    toastRejected: 'Request rejected.',
    toastArchived: 'Request archived.',
    paginationItems: 'requests',
    kwd: 'KWD',
  },
} as const;

@Component({
  selector: 'mm-menu-approval-workspace-page',
  standalone: true,
  imports: [
    DatePipe,
    NgClass,
    NgIcon,
    HasPermissionDirective,
    MmOperationsKpiCardComponent,
    MmTablePaginationComponent,
  ],
  providers: [
    provideIcons({
      lucideArchive,
      lucideBadgeCheck,
      lucideCalendarClock,
      lucideCalendar,
      lucideCheck,
      lucideCircleAlert,
      lucideClipboardCheck,
      lucideFileText,
      lucideFlame,
      lucideGitCompare,
      lucideInfo,
      lucideLanguages,
      lucidePlus,
      lucideScrollText,
      lucideSearch,
      lucideShieldCheck,
      lucideTag,
      lucideUser,
      lucideUtensils,
      lucideWheat,
      lucideX,
    }),
  ],
  templateUrl: './menu-approval-workspace-page.component.html',
  host: { class: 'block' },
})
export class MenuApprovalWorkspacePageComponent {
  readonly locale = inject(AppLocaleService);
  readonly state = inject(OperationsStore);
  readonly perms = AdminPermissions;

  readonly searchQuery = signal('');
  readonly activeFilter = signal<MenuApprovalFilter>('all');
  readonly selectedRequestId = signal<string | null>(null);
  readonly detailModalOpen = signal(false);
  readonly detailTab = signal<MenuDetailTab>('overview');
  readonly toast = signal<string | null>(null);
  readonly detailTabs: MenuDetailTab[] = ['overview', 'meal', 'impact', 'audit'];
  readonly pg = createTablePagination(6);
  readonly currentPage = this.pg.currentPage;
  readonly pageSize = this.pg.pageSize;

  readonly isRtl = computed(() => this.locale.isRtl());
  readonly copy = computed(() => MENU_COPY[this.locale.locale()]);
  readonly kpis = this.state.menuApprovalKpis;

  readonly filters = computed(() => {
    const c = this.copy();
    return [
      { id: 'all', label: c.all },
      { id: 'pending', label: c.pending },
      { id: 'in_review', label: c.inReview },
      { id: 'new_meal', label: c.newMeal },
      { id: 'meal_update', label: c.mealUpdate },
      { id: 'cancel_meal', label: c.cancelMeal },
      { id: 'blocked', label: c.blocked },
      { id: 'label_ready', label: c.labelReady },
      { id: 'restaurant_not_ready', label: c.restaurantNotReady },
    ] as Array<{ id: MenuApprovalFilter; label: string }>;
  });

  readonly rows = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const filter = this.activeFilter();

    return this.state.menuApprovalRequests().filter((request) => {
      const readiness = this.readinessFor(request);
      const matchesFilter =
        filter === 'all' ||
        request.status === filter ||
        request.requestType === filter ||
        (filter === 'blocked' && this.hasCriticalBlockers(request)) ||
        (filter === 'label_ready' && request.meal.labelReady) ||
        (filter === 'restaurant_not_ready' && readiness?.status !== 'ready');

      if (!matchesFilter) return false;
      if (!q) return true;

      return [
        request.id,
        request.restaurantNameAr,
        request.restaurantNameEn,
        request.meal.nameAr,
        request.meal.nameEn,
        request.meal.programsAr.join(' '),
        request.meal.programsEn.join(' '),
      ]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  });

  readonly paginatedRows = this.pg.paginated(this.rows);
  readonly totalPages = this.pg.totalPages(this.rows);
  readonly paginationItems = computed(() => this.copy().paginationItems);

  readonly selectedRequest = computed(() => {
    const selected = this.selectedRequestId();
    if (!selected) return null;
    return this.state.menuApprovalRequests().find((request) => request.id === selected) ?? null;
  });

  readonly selectedAudit = computed(() => {
    const selected = this.selectedRequest();
    if (!selected) return [];
    return this.state
      .menuApprovalAudit()
      .filter((event) => event.requestId === selected.id)
      .slice(0, 5);
  });

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
    this.pg.resetPage();
  }

  setFilter(filter: MenuApprovalFilter): void {
    this.activeFilter.set(filter);
    this.pg.resetPage();
  }

  onPageChange(page: number): void {
    this.pg.onPageChange(page, this.totalPages());
  }

  select(request: MenuApprovalRequest): void {
    this.selectedRequestId.set(request.id);
  }

  openDetails(request: MenuApprovalRequest): void {
    this.select(request);
    this.detailTab.set('overview');
    this.detailModalOpen.set(true);
  }

  setDetailTab(tab: MenuDetailTab): void {
    this.detailTab.set(tab);
  }

  detailTabLabel(tab: MenuDetailTab): string {
    const c = this.copy();
    const labels: Record<MenuDetailTab, string> = {
      overview: c.tabOverview,
      meal: c.tabMeal,
      impact: c.tabImpact,
      audit: c.tabAudit,
    };
    return labels[tab];
  }

  detailTabClass(tab: MenuDetailTab): string {
    return this.detailTab() === tab
      ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-200/70'
      : 'text-slate-500 hover:text-slate-700';
  }

  closeDetails(): void {
    this.detailModalOpen.set(false);
  }

  isSelected(request: MenuApprovalRequest): boolean {
    return this.selectedRequestId() === request.id;
  }

  createRequest(): void {
    this.state.createSampleMenuRequest();
    this.setToast(this.copy().toastCreated);
  }

  startReview(request: MenuApprovalRequest): void {
    this.state.startMenuReview(request.id);
    this.setToast(this.copy().toastReview);
  }

  approve(request: MenuApprovalRequest): void {
    const approved = this.state.approveMenuRequest(request.id);
    this.setToast(approved ? this.copy().toastApproved : this.copy().toastBlocked);
  }

  requestChanges(request: MenuApprovalRequest): void {
    this.state.requestMenuChanges(request.id);
    this.setToast(this.copy().toastChanges);
  }

  reject(request: MenuApprovalRequest): void {
    this.state.rejectMenuRequest(request.id);
    this.setToast(this.copy().toastRejected);
  }

  archive(request: MenuApprovalRequest): void {
    this.state.archiveMenuRequest(request.id);
    this.setToast(this.copy().toastArchived);
  }

  hasCriticalBlockers(request: MenuApprovalRequest): boolean {
    return this.state.menuRequestHasCriticalBlockers(request);
  }

  readinessFor(request: MenuApprovalRequest): RestaurantMenuReadiness | null {
    return (
      this.state
        .menuReadinessRows()
        .find((row) => row.restaurantId === request.restaurantId) ?? null
    );
  }

  statusLabel(status: MenuApprovalStatus): string {
    const c = this.copy();
    const labels: Record<MenuApprovalStatus, string> = {
      pending: c.pending,
      in_review: c.inReview,
      approved: c.approved,
      rejected: c.rejected,
      changes_requested: c.changesRequested,
      cancellation_approved: c.cancellationApproved,
      archived: c.archived,
    };
    return labels[status];
  }

  requestTypeLabel(type: MenuApprovalRequestType): string {
    const c = this.copy();
    const labels: Record<MenuApprovalRequestType, string> = {
      new_meal: c.newMeal,
      meal_update: c.mealUpdate,
      cancel_meal: c.cancelMeal,
    };
    return labels[type];
  }

  mealTypeLabel(type: MenuApprovalRequest['meal']['mealType']): string {
    const c = this.copy();
    return c[type];
  }

  blockerLabel(code: string): string {
    const c = this.copy();
    const labels: Record<string, string> = {
      missing_translation: c.missingTranslation,
      missing_nutrition: c.missingNutrition,
      missing_allergens: c.missingAllergens,
      missing_price: c.missingPrice,
    };
    return labels[code] ?? code;
  }

  statusClass(status: MenuApprovalStatus): string {
    return (
      {
        pending: 'bg-amber-50 text-amber-700 ring-amber-100',
        in_review: 'bg-blue-50 text-blue-700 ring-blue-100',
        approved: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
        rejected: 'bg-rose-50 text-rose-700 ring-rose-100',
        changes_requested: 'bg-orange-50 text-orange-700 ring-orange-100',
        cancellation_approved: 'bg-violet-50 text-violet-700 ring-violet-100',
        archived: 'bg-slate-100 text-slate-600 ring-slate-200',
      } satisfies Record<MenuApprovalStatus, string>
    )[status];
  }

  readinessLabel(status: RestaurantMenuReadiness['status']): string {
    const c = this.copy();
    return (
      {
        ready: c.ready,
        needs_menu: c.needsMenu,
        needs_pricing: c.needsPricing,
        needs_labels: c.needsLabels,
      } satisfies Record<RestaurantMenuReadiness['status'], string>
    )[status];
  }

  readinessClass(status: RestaurantMenuReadiness['status']): string {
    return (
      {
        ready: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
        needs_menu: 'bg-amber-50 text-amber-700 ring-amber-100',
        needs_pricing: 'bg-rose-50 text-rose-700 ring-rose-100',
        needs_labels: 'bg-violet-50 text-violet-700 ring-violet-100',
      } satisfies Record<RestaurantMenuReadiness['status'], string>
    )[status];
  }

  terminal(request: MenuApprovalRequest): boolean {
    return ['approved', 'rejected', 'cancellation_approved', 'archived'].includes(request.status);
  }

  priceChangedWithActive(request: MenuApprovalRequest): boolean {
    return (
      request.requestType === 'meal_update' &&
      request.activeSubscriptionsCount > 0 &&
      request.previousMeal?.priceKd !== request.meal.priceKd
    );
  }

  restaurantName(request: MenuApprovalRequest): string {
    return this.isRtl() ? request.restaurantNameAr : request.restaurantNameEn;
  }

  mealName(request: MenuApprovalRequest): string {
    return this.isRtl() ? request.meal.nameAr || request.meal.nameEn : request.meal.nameEn || request.meal.nameAr;
  }

  requestReason(request: MenuApprovalRequest): string {
    const reason = this.isRtl() ? request.reasonAr : request.reasonEn;
    const fallback = this.isRtl() ? request.reasonEn : request.reasonAr;
    return reason || fallback || this.copy().noReason;
  }

  submittedByName(request: MenuApprovalRequest): string {
    const name = this.isRtl() ? request.submittedByNameAr : request.submittedByNameEn;
    const fallback = this.isRtl() ? request.submittedByNameEn : request.submittedByNameAr;
    return name || fallback || '-';
  }

  hasPreviousMeal(request: MenuApprovalRequest): boolean {
    return !!request.previousMeal && request.requestType === 'meal_update';
  }

  dataChecks(request: MenuApprovalRequest): MenuDataCheck[] {
    const c = this.copy();
    const meal = request.meal;
    const nutritionComplete =
      meal.nutrition.calories !== null &&
      meal.nutrition.proteinGrams !== null &&
      meal.nutrition.carbsGrams !== null &&
      meal.nutrition.fatGrams !== null;

    return [
      {
        label: c.bilingualNames,
        ok: !!(meal.nameAr?.trim() && meal.nameEn?.trim() && meal.descriptionAr?.trim() && meal.descriptionEn?.trim()),
      },
      { label: c.nutrition, ok: nutritionComplete },
      {
        label: c.allergens,
        ok: meal.allergensAr.length > 0 && meal.allergensEn.length > 0,
      },
      { label: c.price, ok: meal.priceKd !== null },
      { label: c.labelReady, ok: meal.labelReady },
    ];
  }

  comparisonRows(request: MenuApprovalRequest): MenuComparisonRow[] {
    if (!request.previousMeal) return [];

    const c = this.copy();
    const prev = request.previousMeal;
    const next = request.meal;

    const rows: MenuComparisonRow[] = [
      {
        label: c.price,
        before: this.formatKd(prev.priceKd),
        after: this.formatKd(next.priceKd),
        changed: prev.priceKd !== next.priceKd,
      },
      {
        label: c.calories,
        before: this.formatNutrition(prev.nutrition.calories, 'kcal'),
        after: this.formatNutrition(next.nutrition.calories, 'kcal'),
        changed: prev.nutrition.calories !== next.nutrition.calories,
      },
      {
        label: c.protein,
        before: this.formatNutrition(prev.nutrition.proteinGrams, 'g'),
        after: this.formatNutrition(next.nutrition.proteinGrams, 'g'),
        changed: prev.nutrition.proteinGrams !== next.nutrition.proteinGrams,
      },
      {
        label: c.carbs,
        before: this.formatNutrition(prev.nutrition.carbsGrams, 'g'),
        after: this.formatNutrition(next.nutrition.carbsGrams, 'g'),
        changed: prev.nutrition.carbsGrams !== next.nutrition.carbsGrams,
      },
      {
        label: c.fat,
        before: this.formatNutrition(prev.nutrition.fatGrams, 'g'),
        after: this.formatNutrition(next.nutrition.fatGrams, 'g'),
        changed: prev.nutrition.fatGrams !== next.nutrition.fatGrams,
      },
      {
        label: c.sodium,
        before: this.formatNutrition(prev.nutrition.sodiumMg ?? null, 'mg'),
        after: this.formatNutrition(next.nutrition.sodiumMg ?? null, 'mg'),
        changed: (prev.nutrition.sodiumMg ?? null) !== (next.nutrition.sodiumMg ?? null),
      },
    ];

    return rows;
  }

  formatNutrition(value: number | null, unit: string): string {
    if (value === null) return '-';
    return `${this.formatNumber(value)} ${unit}`;
  }

  completenessLabel(ok: boolean): string {
    return ok ? this.copy().complete : this.copy().incomplete;
  }

  completenessClass(ok: boolean): string {
    return ok
      ? 'border-emerald-100 bg-emerald-50/80 text-emerald-800'
      : 'border-rose-100 bg-rose-50/80 text-rose-800';
  }

  mealDescription(request: MenuApprovalRequest): string {
    return this.isRtl()
      ? request.meal.descriptionAr || request.meal.descriptionEn
      : request.meal.descriptionEn || request.meal.descriptionAr;
  }

  list(valuesAr: string[], valuesEn: string[]): string {
    return (this.isRtl() ? valuesAr : valuesEn).join(this.isRtl() ? '، ' : ', ') || '-';
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat(this.isRtl() ? 'ar-KW' : 'en-US').format(value);
  }

  formatKd(value: number | null): string {
    if (value === null) return '-';
    return `${new Intl.NumberFormat(this.isRtl() ? 'ar-KW' : 'en-US', {
      maximumFractionDigits: value % 1 ? 2 : 0,
    }).format(value)} ${this.copy().kwd}`;
  }

  private setToast(message: string): void {
    this.toast.set(message);
    setTimeout(() => this.toast.set(null), 2500);
  }
}
