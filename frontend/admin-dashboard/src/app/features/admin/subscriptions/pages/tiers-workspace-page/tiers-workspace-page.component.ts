import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideAward,
  lucideShieldAlert,
  lucideRefreshCw,
  lucideFilter,
  lucideX,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { AdminPermissions } from '@/core/auth/admin-permissions';
import { SUBSCRIPTIONS_I18N, TIER_LABELS } from '@/core/i18n/translations/subscriptions.i18n';
import { HasPermissionDirective } from '@/shared/directives/has-permission.directive';
import { MmTablePaginationComponent } from '@/shared/components/layout/table-pagination';
import { createTablePagination } from '@/shared/utils/table-pagination.util';
import { SubscriptionsStore } from '../../data/subscriptions-store';
import { ClassificationRow, OutlierActionType, RestaurantTier } from '../../models';
import { MmOperationsKpiCardComponent } from '@/shared/components/operations';
import { MmDetailToastComponent } from '@/shared/components/accounts';

@Component({
  selector: 'mm-tiers-workspace-page',
  standalone: true,
  imports: [DecimalPipe, NgClass, RouterLink, NgIcon, MmOperationsKpiCardComponent, MmDetailToastComponent, HasPermissionDirective, MmTablePaginationComponent],
  providers: [provideIcons({ lucideAward, lucideShieldAlert, lucideRefreshCw, lucideFilter, lucideX })],
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

  readonly filteredRows = computed(() => {
    let rows = this.store.classifications();
    if (this.programFilter() !== 'all') rows = rows.filter((r) => r.programId === this.programFilter());
    if (this.bundleFilter() !== 'all') rows = rows.filter((r) => r.bundleId === this.bundleFilter());
    if (this.tierFilter() !== 'all') {
      rows = rows.filter((r) => this.store.effectiveTier(r) === this.tierFilter());
    }
    if (this.flaggedOnly()) rows = rows.filter((r) => r.isOutlier);
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
