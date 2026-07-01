import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe, DatePipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideAward,
  lucideShieldAlert,
  lucideRefreshCw,
  lucideX,
  lucideCrown,
  lucideSparkles,
  lucideSearch,
  lucideChevronDown,
  lucideChevronRight,
  lucideSettings2,
  lucideSlidersHorizontal,
  lucideUser,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { AdminPermissions } from '@/core/auth/admin-permissions';
import { SUBSCRIPTIONS_I18N, TIER_LABELS } from '@/core/i18n/translations/subscriptions.i18n';
import { HasPermissionDirective } from '@/shared/directives/has-permission.directive';
import { MmTablePaginationComponent } from '@/shared/components/layout/table-pagination';
import { createTablePagination } from '@/shared/utils/table-pagination.util';
import { SubscriptionsStore } from '../../data/subscriptions-store';
import { ClassificationRow, OutlierActionType, RecalculationEvent, RestaurantTier } from '../../models';
import { MmDetailToastComponent } from '@/shared/components/accounts';

@Component({
  selector: 'mm-tiers-workspace-page',
  standalone: true,
  imports: [
    DecimalPipe,
    DatePipe,
    NgClass,
    RouterLink,
    NgIcon,
    MmDetailToastComponent,
    HasPermissionDirective,
    MmTablePaginationComponent,
  ],
  providers: [
    provideIcons({
      lucideAward,
      lucideShieldAlert,
      lucideRefreshCw,
      lucideX,
      lucideCrown,
      lucideSparkles,
      lucideSearch,
      lucideChevronDown,
      lucideChevronRight,
      lucideSettings2,
      lucideSlidersHorizontal,
      lucideUser,
    }),
  ],
  templateUrl: './tiers-workspace-page.component.html',
  host: { class: 'block' },
})
export class TiersWorkspacePageComponent {
  readonly locale = inject(AppLocaleService);
  readonly store = inject(SubscriptionsStore);
  readonly perms = AdminPermissions;

  readonly copy = computed(() => SUBSCRIPTIONS_I18N[this.locale.locale()]);
  readonly programFilter = signal('all');
  readonly bundleFilter = signal('all');
  readonly tierFilter = signal<'all' | RestaurantTier>('all');
  readonly flaggedOnly = signal(false);
  readonly searchQuery = signal('');
  readonly recalcExpanded = signal(false);
  readonly settingsExpanded = signal(false);

  readonly boundsBasic = signal(this.store.singleRestaurantBounds().basicMaxDailyKd);
  readonly boundsElite = signal(this.store.singleRestaurantBounds().eliteMinDailyKd);

  readonly outlierRow = signal<ClassificationRow | null>(null);
  readonly outlierAction = signal<OutlierActionType>('keep');
  readonly outlierReason = signal('');
  readonly toast = signal<string | null>(null);
  readonly pg = createTablePagination(5);
  readonly currentPage = this.pg.currentPage;
  readonly pageSize = this.pg.pageSize;

  readonly dist = computed(() => this.store.tierDistribution());

  readonly tierCounts = computed(() => {
    const rows = this.store.classifications().filter((r) => !r.isExcluded);
    return {
      basic: rows.filter((r) => this.store.effectiveTier(r) === 'basic').length,
      platinum: rows.filter((r) => this.store.effectiveTier(r) === 'platinum').length,
      elite: rows.filter((r) => this.store.effectiveTier(r) === 'elite').length,
      total: rows.length,
    };
  });

  readonly filteredRows = computed(() => {
    let rows = this.store.classifications();
    const q = this.searchQuery().toLowerCase().trim();
    if (this.programFilter() !== 'all') rows = rows.filter((r) => r.programId === this.programFilter());
    if (this.bundleFilter() !== 'all') rows = rows.filter((r) => r.bundleId === this.bundleFilter());
    if (this.tierFilter() !== 'all') {
      rows = rows.filter((r) => this.store.effectiveTier(r) === this.tierFilter());
    }
    if (this.flaggedOnly()) rows = rows.filter((r) => r.isOutlier);
    if (q) {
      rows = rows.filter(
        (r) =>
          r.restaurantName.toLowerCase().includes(q) ||
          r.restaurantId.toLowerCase().includes(q) ||
          r.programNameAr.toLowerCase().includes(q) ||
          r.programNameEn.toLowerCase().includes(q) ||
          r.bundleNameAr.toLowerCase().includes(q) ||
          r.bundleNameEn.toLowerCase().includes(q),
      );
    }
    return rows;
  });

  readonly paginatedRows = this.pg.paginated(this.filteredRows);
  readonly totalPages = this.pg.totalPages(this.filteredRows);
  readonly paginationItems = computed(() => (this.locale.isRtl() ? 'مطعم' : 'restaurants'));

  readonly programOptions = computed(() => {
    const map = new Map<string, { id: string; ar: string; en: string }>();
    for (const r of this.store.classifications()) {
      map.set(r.programId, { id: r.programId, ar: r.programNameAr, en: r.programNameEn });
    }
    return [...map.values()];
  });

  readonly bundleOptions = computed(() => {
    const map = new Map<string, { id: string; ar: string; en: string }>();
    for (const r of this.store.classifications()) {
      map.set(r.bundleId, { id: r.bundleId, ar: r.bundleNameAr, en: r.bundleNameEn });
    }
    return [...map.values()];
  });

  tierLabel(tier: RestaurantTier): string {
    return TIER_LABELS[this.locale.locale()][tier] ?? tier;
  }

  effectiveTier(row: ClassificationRow): RestaurantTier {
    return this.store.effectiveTier(row);
  }

  rowName(row: { programNameAr: string; programNameEn: string; bundleNameAr: string; bundleNameEn: string }): string {
    return this.locale.isRtl()
      ? `${row.programNameAr} / ${row.bundleNameAr}`
      : `${row.programNameEn} / ${row.bundleNameEn}`;
  }

  tierBadgeClass(tier: RestaurantTier): string {
    if (tier === 'elite') return 'bg-amber-50 text-amber-700 ring-amber-600/15';
    if (tier === 'platinum') return 'bg-violet-50 text-violet-700 ring-violet-600/15';
    return 'bg-slate-50 text-slate-700 ring-slate-600/15';
  }

  tierDotClass(tier: RestaurantTier): string {
    if (tier === 'elite') return 'bg-amber-500';
    if (tier === 'platinum') return 'bg-violet-500';
    return 'bg-slate-400';
  }

  profitBadgeClass(profit: number): string {
    if (profit < 0.5) return 'bg-rose-50 text-rose-700 ring-rose-600/15';
    if (profit < 1) return 'bg-amber-50 text-amber-700 ring-amber-600/15';
    return 'bg-emerald-50 text-emerald-700 ring-emerald-600/15';
  }

  profitDotClass(profit: number): string {
    if (profit < 0.5) return 'bg-rose-500';
    if (profit < 1) return 'bg-amber-500';
    return 'bg-emerald-500';
  }

  recalcSummary(event: RecalculationEvent): string {
    return this.locale.isRtl() ? event.summaryAr : event.summaryEn;
  }

  recalcTypeLabel(type: RecalculationEvent['type']): string {
    const ar: Record<RecalculationEvent['type'], string> = {
      price_change: 'تغيير سعر',
      restaurant_join: 'انضمام مطعم',
      bounds_change: 'تعديل حدود',
      commission_change: 'تغيير عمولة',
    };
    const en: Record<RecalculationEvent['type'], string> = {
      price_change: 'Price change',
      restaurant_join: 'Restaurant join',
      bounds_change: 'Bounds change',
      commission_change: 'Commission change',
    };
    return this.locale.isRtl() ? ar[type] : en[type];
  }

  setTierFilter(tier: 'all' | RestaurantTier): void {
    this.tierFilter.set(tier);
    this.pg.resetPage();
  }

  onProgramFilterChange(value: string): void {
    this.programFilter.set(value);
    this.pg.resetPage();
  }

  onBundleFilterChange(value: string): void {
    this.bundleFilter.set(value);
    this.pg.resetPage();
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
    this.pg.resetPage();
  }

  toggleFlaggedOnly(): void {
    this.flaggedOnly.update((v) => !v);
    this.pg.resetPage();
  }

  toggleRecalc(): void {
    this.recalcExpanded.update((v) => !v);
  }

  toggleSettings(): void {
    this.settingsExpanded.update((v) => !v);
  }

  applyBounds(): void {
    this.store.updateSingleBounds({
      basicMaxDailyKd: this.boundsBasic(),
      eliteMinDailyKd: this.boundsElite(),
    });
    this.toast.set(this.copy().saved);
    setTimeout(() => this.toast.set(null), 3000);
  }

  openOutlier(row: ClassificationRow): void {
    this.outlierRow.set(row);
    this.outlierAction.set('keep');
    this.outlierReason.set('');
  }

  closeOutlier(): void {
    this.outlierRow.set(null);
  }

  confirmOutlier(): void {
    const row = this.outlierRow();
    if (!row || !this.outlierReason().trim()) return;
    this.store.applyOutlierAction(row, this.outlierAction(), this.outlierReason().trim());
    this.closeOutlier();
    this.toast.set(this.copy().saved);
    setTimeout(() => this.toast.set(null), 3000);
  }

  onPageChange(page: number): void {
    this.pg.onPageChange(page, this.totalPages());
  }
}
