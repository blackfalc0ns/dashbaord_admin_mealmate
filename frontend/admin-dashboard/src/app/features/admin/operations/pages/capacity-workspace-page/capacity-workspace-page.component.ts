import { DatePipe, NgClass } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideActivity,
  lucideGauge,
  lucideCirclePause,
  lucideSearch,
  lucideShieldAlert,
  lucideLockOpen,
  lucideUtensils,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { MmOperationsKpiCardComponent } from '@/shared/components/operations';
import { MmTablePaginationComponent } from '@/shared/components/layout/table-pagination';
import { createTablePagination } from '@/shared/utils/table-pagination.util';
import { OperationsStore } from '../../data/operations-store';
import { CapacityStatus, RestaurantCapacityRow } from '../../models';

type CapacityFilter = 'all' | CapacityStatus;

@Component({
  selector: 'mm-capacity-workspace-page',
  standalone: true,
  imports: [DatePipe, NgClass, NgIcon, MmOperationsKpiCardComponent, MmTablePaginationComponent],
  providers: [
    provideIcons({
      lucideActivity,
      lucideGauge,
      lucideCirclePause,
      lucideSearch,
      lucideShieldAlert,
      lucideLockOpen,
      lucideUtensils,
    }),
  ],
  templateUrl: './capacity-workspace-page.component.html',
  host: { class: 'block' },
})
export class CapacityWorkspacePageComponent {
  readonly locale = inject(AppLocaleService);
  readonly state = inject(OperationsStore);

  readonly searchQuery = signal('');
  readonly activeFilter = signal<CapacityFilter>('all');
  readonly selectedRestaurantId = signal<string | null>(null);
  readonly toast = signal<string | null>(null);
  readonly pg = createTablePagination(5);
  readonly currentPage = this.pg.currentPage;
  readonly pageSize = this.pg.pageSize;

  readonly isRtl = computed(() => this.locale.isRtl());
  readonly copy = computed(() => (this.isRtl() ? AR_COPY : EN_COPY));
  readonly kpis = this.state.capacityKpis;

  readonly statusFilters: { id: CapacityFilter; tone: string }[] = [
    { id: 'all', tone: 'slate' },
    { id: 'active', tone: 'emerald' },
    { id: 'at_risk', tone: 'amber' },
    { id: 'busy_auto', tone: 'red' },
    { id: 'busy_manual', tone: 'violet' },
    { id: 'suspended', tone: 'slate' },
  ];

  readonly rows = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const filter = this.activeFilter();
    return this.state.capacityRows().filter((row) => {
      const matchesFilter = filter === 'all' || row.status === filter;
      const matchesSearch =
        !q ||
        row.restaurantName.toLowerCase().includes(q) ||
        row.restaurantId.toLowerCase().includes(q) ||
        row.areaName.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  });

  readonly paginatedRows = this.pg.paginated(this.rows);
  readonly totalPages = this.pg.totalPages(this.rows);
  readonly paginationItems = computed(() => (this.isRtl() ? 'مطعم' : 'restaurants'));

  readonly selectedRow = computed(() => {
    const selected = this.selectedRestaurantId();
    return (
      this.state.capacityRows().find((row) => row.restaurantId === selected) ??
      this.rows()[0] ??
      null
    );
  });

  readonly selectedAudit = computed(() => {
    const selected = this.selectedRow();
    if (!selected) return [];
    return this.state
      .capacityAudit()
      .filter((event) => event.restaurantId === selected.restaurantId)
      .slice(0, 4);
  });

  setFilter(filter: CapacityFilter): void {
    this.activeFilter.set(filter);
    this.pg.resetPage();
  }

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
    this.pg.resetPage();
  }

  onPageChange(page: number): void {
    this.pg.onPageChange(page, this.totalPages());
  }

  select(row: RestaurantCapacityRow): void {
    this.selectedRestaurantId.set(row.restaurantId);
  }

  utilization(row: RestaurantCapacityRow): number {
    return row.capacityLimit ? Math.round((row.bookedMeals / row.capacityLimit) * 100) : 0;
  }

  available(row: RestaurantCapacityRow): number {
    return Math.max(row.capacityLimit - row.bookedMeals - row.blockedMeals, 0);
  }

  statusLabel(status: CapacityStatus | 'all'): string {
    return this.copy().statuses[status];
  }

  statusClass(status: CapacityStatus): string {
    return (
      {
        active: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
        at_risk: 'bg-amber-50 text-amber-700 ring-amber-100',
        busy_auto: 'bg-red-50 text-red-700 ring-red-100',
        busy_manual: 'bg-violet-50 text-violet-700 ring-violet-100',
        suspended: 'bg-slate-100 text-slate-600 ring-slate-200',
      } satisfies Record<CapacityStatus, string>
    )[status];
  }

  progressClass(row: RestaurantCapacityRow): string {
    if (row.status === 'busy_auto' || row.status === 'busy_manual') return 'bg-red-500';
    if (row.status === 'at_risk') return 'bg-amber-500';
    if (row.status === 'suspended') return 'bg-slate-400';
    return 'bg-emerald-500';
  }

  markBusy(row: RestaurantCapacityRow): void {
    this.state.markRestaurantBusy(row.restaurantId, this.copy().manualBusyReason);
    this.toast.set(this.copy().manualBusyToast);
    setTimeout(() => this.toast.set(null), 2500);
  }

  releaseBusy(row: RestaurantCapacityRow): void {
    this.state.releaseRestaurantBusy(row.restaurantId);
    this.toast.set(this.copy().releaseBusyToast);
    setTimeout(() => this.toast.set(null), 2500);
  }
}

const EN_COPY = {
  title: 'Restaurant capacity',
  subtitle: 'Daily capacity rules, 72h demand pressure, and busy automation from F031/F032.',
  search: 'Search restaurant, ID, or area...',
  totalCapacity: 'Total capacity',
  bookedMeals: 'Booked meals',
  utilization: 'Utilization',
  busyRestaurants: 'Busy restaurants',
  atRisk: 'At risk',
  overrides: 'Overrides',
  capacityDesc: 'Approved daily rules',
  bookedDesc: 'Meals assigned today',
  utilizationDesc: 'Booked against capacity',
  busyDesc: 'Auto or manual busy',
  riskDesc: 'Above threshold',
  overrideDesc: 'Manual audit trail',
  restaurants: 'Restaurants',
  restaurant: 'Restaurant',
  area: 'Area',
  window: 'Window',
  status: 'Status',
  capacity: 'Capacity',
  booked: 'Booked',
  confirmed: 'Confirmed',
  pending72h: 'Pending 72h',
  blocked: 'Blocked',
  available: 'Available',
  ruleVersion: 'Rule version',
  updated: 'Updated',
  source: 'Source',
  automationReason: 'Automation reason',
  auditTrail: 'Audit trail',
  noRows: 'No restaurants match this filter.',
  markBusy: 'Mark busy',
  releaseBusy: 'Release busy',
  manualBusyReason: 'Manual busy override from capacity workspace.',
  manualBusyToast: 'Manual busy override recorded.',
  releaseBusyToast: 'Busy override released.',
  statuses: {
    all: 'All',
    active: 'Active',
    at_risk: 'At risk',
    busy_auto: 'Auto busy',
    busy_manual: 'Manual busy',
    suspended: 'Suspended',
  },
};

const AR_COPY: typeof EN_COPY = {
  title: 'طاقة المطاعم',
  subtitle: 'قواعد الطاقة اليومية وضغط نافذة 72 ساعة وحالة Busy التلقائية من F031/F032.',
  search: 'ابحث باسم المطعم أو الرقم أو المنطقة...',
  totalCapacity: 'إجمالي الطاقة',
  bookedMeals: 'وجبات محجوزة',
  utilization: 'نسبة الاستخدام',
  busyRestaurants: 'مطاعم Busy',
  atRisk: 'قريبة من الامتلاء',
  overrides: 'تدخلات يدوية',
  capacityDesc: 'قواعد يومية معتمدة',
  bookedDesc: 'وجبات موزعة اليوم',
  utilizationDesc: 'الحجز مقابل الطاقة',
  busyDesc: 'تلقائي أو يدوي',
  riskDesc: 'فوق حد التنبيه',
  overrideDesc: 'مسجلة في التدقيق',
  restaurants: 'المطاعم',
  restaurant: 'المطعم',
  area: 'المنطقة',
  window: 'الفترة',
  status: 'الحالة',
  capacity: 'الطاقة',
  booked: 'محجوز',
  confirmed: 'مؤكد',
  pending72h: 'بانتظار 72h',
  blocked: 'محجوب',
  available: 'متاح',
  ruleVersion: 'نسخة القاعدة',
  updated: 'آخر تحديث',
  source: 'المصدر',
  automationReason: 'سبب الأتمتة',
  auditTrail: 'سجل التدقيق',
  noRows: 'لا توجد مطاعم مطابقة لهذا الفلتر.',
  markBusy: 'تعيين Busy',
  releaseBusy: 'إلغاء Busy',
  manualBusyReason: 'تدخل يدوي من شاشة طاقة المطاعم.',
  manualBusyToast: 'تم تسجيل تدخل Busy اليدوي.',
  releaseBusyToast: 'تم إلغاء تدخل Busy.',
  statuses: {
    all: 'الكل',
    active: 'نشط',
    at_risk: 'قريب من الحد',
    busy_auto: 'Busy تلقائي',
    busy_manual: 'Busy يدوي',
    suspended: 'موقوف',
  },
};
