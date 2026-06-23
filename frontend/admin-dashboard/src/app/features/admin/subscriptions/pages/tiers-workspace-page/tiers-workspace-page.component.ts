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
import { SUBSCRIPTIONS_I18N, TIER_LABELS } from '@/core/i18n/translations/subscriptions.i18n';
import { SubscriptionsStateService } from '../../data/subscriptions-state.service';
import { ClassificationRow, OutlierActionType, RestaurantTier } from '../../models';
import { MmOperationsKpiCardComponent } from '@/shared/components/operations';
import { MmDetailToastComponent } from '@/shared/components/accounts';

@Component({
  selector: 'mm-tiers-workspace-page',
  standalone: true,
  imports: [DecimalPipe, NgClass, RouterLink, NgIcon, MmOperationsKpiCardComponent, MmDetailToastComponent],
  providers: [provideIcons({ lucideAward, lucideShieldAlert, lucideRefreshCw, lucideFilter, lucideX })],
  templateUrl: './tiers-workspace-page.component.html',
  host: { class: 'block' },
})
export class TiersWorkspacePageComponent {
  readonly locale = inject(AppLocaleService);
  readonly state = inject(SubscriptionsStateService);

  readonly copy = computed(() => SUBSCRIPTIONS_I18N[this.locale.locale()]);
  readonly programFilter = signal('all');
  readonly bundleFilter = signal('all');
  readonly tierFilter = signal<'all' | RestaurantTier>('all');
  readonly flaggedOnly = signal(false);

  readonly boundsBasic = signal(this.state.singleRestaurantBounds().basicMaxDailyKd);
  readonly boundsElite = signal(this.state.singleRestaurantBounds().eliteMinDailyKd);

  readonly outlierRow = signal<ClassificationRow | null>(null);
  readonly outlierAction = signal<OutlierActionType>('keep');
  readonly outlierReason = signal('');
  readonly toast = signal<string | null>(null);

  readonly dist = computed(() => this.state.tierDistribution());

  readonly filteredRows = computed(() => {
    let rows = this.state.classifications();
    if (this.programFilter() !== 'all') rows = rows.filter((r) => r.programId === this.programFilter());
    if (this.bundleFilter() !== 'all') rows = rows.filter((r) => r.bundleId === this.bundleFilter());
    if (this.tierFilter() !== 'all') {
      rows = rows.filter((r) => this.state.effectiveTier(r) === this.tierFilter());
    }
    if (this.flaggedOnly()) rows = rows.filter((r) => r.isOutlier);
    return rows;
  });

  readonly programOptions = computed(() => {
    const map = new Map<string, { id: string; ar: string; en: string }>();
    for (const r of this.state.classifications()) {
      map.set(r.programId, { id: r.programId, ar: r.programNameAr, en: r.programNameEn });
    }
    return [...map.values()];
  });

  readonly bundleOptions = computed(() => {
    const map = new Map<string, { id: string; ar: string; en: string }>();
    for (const r of this.state.classifications()) {
      map.set(r.bundleId, { id: r.bundleId, ar: r.bundleNameAr, en: r.bundleNameEn });
    }
    return [...map.values()];
  });

  tierLabel(tier: RestaurantTier): string {
    return TIER_LABELS[this.locale.locale()][tier] ?? tier;
  }

  effectiveTier(row: ClassificationRow): RestaurantTier {
    return this.state.effectiveTier(row);
  }

  rowName(row: { programNameAr: string; programNameEn: string; bundleNameAr: string; bundleNameEn: string }): string {
    return this.locale.isRtl()
      ? `${row.programNameAr} / ${row.bundleNameAr}`
      : `${row.programNameEn} / ${row.bundleNameEn}`;
  }

  applyBounds(): void {
    this.state.updateSingleBounds({
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
    this.state.applyOutlierAction(row, this.outlierAction(), this.outlierReason().trim());
    this.closeOutlier();
    this.toast.set(this.copy().saved);
    setTimeout(() => this.toast.set(null), 3000);
  }
}
