import { Component, computed, effect, inject, signal } from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucidePercent,
  lucideShieldAlert,
  lucideGlobe,
  lucidePackage,
  lucideTrendingDown,
  lucideX,
  lucideSettings2,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { AdminPermissions } from '@/core/auth/admin-permissions';
import { SUBSCRIPTIONS_I18N, TIER_LABELS } from '@/core/i18n/translations/subscriptions.i18n';
import { HasPermissionDirective } from '@/shared/directives/has-permission.directive';
import { SubscriptionsStore } from '../../data/subscriptions-store';
import { PlatformCommissionBounds, PlatformCommissionMode, RestaurantTier } from '../../models';
import { commissionPct } from '../../data/subscription-formulas';
import { MmOperationsKpiCardComponent } from '@/shared/components/operations';
import { MmDetailPanelCardComponent } from '@/shared/components/accounts';
import { MmDetailToastComponent } from '@/shared/components/accounts';

const PREVIEW_DAYS = [1, 6, 12, 26] as const;

@Component({
  selector: 'mm-pricing-workspace-page',
  standalone: true,
  imports: [
    DecimalPipe,
    NgClass,
    FormsModule,
    NgIcon,
    MmOperationsKpiCardComponent,
    MmDetailPanelCardComponent,
    MmDetailToastComponent,
    HasPermissionDirective,
  ],
  providers: [
    provideIcons({
      lucidePercent,
      lucideShieldAlert,
      lucideGlobe,
      lucidePackage,
      lucideTrendingDown,
      lucideX,
      lucideSettings2,
    }),
  ],
  templateUrl: './pricing-workspace-page.component.html',
  host: { class: 'block' },
})
export class PricingWorkspacePageComponent {
  readonly locale = inject(AppLocaleService);
  readonly store = inject(SubscriptionsStore);
  readonly perms = AdminPermissions;

  readonly copy = computed(() => SUBSCRIPTIONS_I18N[this.locale.locale()]);
  readonly previewDays = PREVIEW_DAYS;

  readonly modeDraft = signal<PlatformCommissionMode>('global');
  readonly globalMax = signal(30);
  readonly globalMin = signal(15);
  readonly bundleBoundsDraft = signal<Record<string, PlatformCommissionBounds>>({});
  readonly toast = signal<string | null>(null);
  readonly dirty = signal(false);
  readonly commissionModalOpen = signal(false);

  readonly alerts = computed(() => this.store.profitabilityAlerts());
  readonly tierAverages = computed(() => this.store.tierAverages());

  readonly activeBundles = computed(() =>
    this.store.bundles().filter((b) => b.status === 'active' || b.status === 'hidden_for_new'),
  );

  readonly commissionModeLabel = computed(() => {
    const c = this.copy();
    return this.store.platformCommissionConfig().mode === 'global'
      ? c.commissionModeGlobal
      : c.commissionModePerBundle;
  });

  readonly kpiMaxDisplay = computed(() => {
    const cfg = this.store.platformCommissionConfig();
    if (cfg.mode === 'global') return `${cfg.global.maxCommissionPct}${this.copy().pct}`;
    const values = Object.values(cfg.perBundle).map((b) => b.maxCommissionPct);
    if (!values.length) return `${cfg.global.maxCommissionPct}${this.copy().pct}`;
    return `${Math.max(...values)}${this.copy().pct}`;
  });

  readonly kpiMinDisplay = computed(() => {
    const cfg = this.store.platformCommissionConfig();
    if (cfg.mode === 'global') return `${cfg.global.minCommissionPct}${this.copy().pct}`;
    const values = Object.values(cfg.perBundle).map((b) => b.minCommissionPct);
    if (!values.length) return `${cfg.global.minCommissionPct}${this.copy().pct}`;
    return `${Math.min(...values)}${this.copy().pct}`;
  });

  readonly profitAlertsSummary = computed(() => {
    const list = this.alerts();
    const c = this.copy();
    if (!list.length) return c.profitAlertsClear;
    const danger = list.filter((a) => a.severity === 'danger').length;
    const warning = list.filter((a) => a.severity === 'warning').length;
    const parts: string[] = [];
    if (danger) parts.push(`${danger} ${c.profitAlertsDanger}`);
    if (warning) parts.push(`${warning} ${c.profitAlertsWarning}`);
    return parts.join(' · ');
  });

  constructor() {
    effect(() => {
      const cfg = this.store.platformCommissionConfig();
      if (this.dirty()) return;
      this.modeDraft.set(cfg.mode);
      this.globalMax.set(cfg.global.maxCommissionPct);
      this.globalMin.set(cfg.global.minCommissionPct);
      this.bundleBoundsDraft.set(
        Object.fromEntries(
          Object.entries(cfg.perBundle).map(([id, bounds]) => [id, { ...bounds }]),
        ),
      );
    });
  }

  tierLabel(tier: RestaurantTier): string {
    return TIER_LABELS[this.locale.locale()][tier] ?? tier;
  }

  programBundleLabel(row: {
    programNameAr: string;
    programNameEn: string;
    bundleNameAr: string;
    bundleNameEn: string;
  }): string {
    return this.locale.isRtl()
      ? `${row.programNameAr} / ${row.bundleNameAr}`
      : `${row.programNameEn} / ${row.bundleNameEn}`;
  }

  bundleName(bundle: { nameAr: string; nameEn: string }): string {
    return this.locale.isRtl() ? bundle.nameAr : bundle.nameEn;
  }

  openCommissionModal(): void {
    this.resetDraftFromState();
    this.commissionModalOpen.set(true);
  }

  closeCommissionModal(): void {
    this.resetDraftFromState();
    this.commissionModalOpen.set(false);
  }

  private resetDraftFromState(): void {
    const cfg = this.store.platformCommissionConfig();
    this.modeDraft.set(cfg.mode);
    this.globalMax.set(cfg.global.maxCommissionPct);
    this.globalMin.set(cfg.global.minCommissionPct);
    this.bundleBoundsDraft.set(
      Object.fromEntries(
        Object.entries(cfg.perBundle).map(([id, bounds]) => [id, { ...bounds }]),
      ),
    );
    this.dirty.set(false);
  }

  setMode(mode: PlatformCommissionMode): void {
    this.modeDraft.set(mode);
    this.dirty.set(true);
  }

  onGlobalChange(): void {
    this.dirty.set(true);
  }

  onBundleBoundChange(bundleId: string, field: 'maxCommissionPct' | 'minCommissionPct', value: number): void {
    this.bundleBoundsDraft.update((draft) => ({
      ...draft,
      [bundleId]: {
        ...(draft[bundleId] ?? {
          maxCommissionPct: this.globalMax(),
          minCommissionPct: this.globalMin(),
        }),
        [field]: value,
      },
    }));
    this.dirty.set(true);
  }

  boundsForBundleDraft(bundleId: string): PlatformCommissionBounds {
    return (
      this.bundleBoundsDraft()[bundleId] ?? {
        maxCommissionPct: this.globalMax(),
        minCommissionPct: this.globalMin(),
      }
    );
  }

  previewPct(bounds: PlatformCommissionBounds, days: number): number {
    return commissionPct(days, bounds.maxCommissionPct, bounds.minCommissionPct);
  }

  barWidth(pct: number, max: number, min: number): number {
    if (max <= min) return 100;
    return Math.max(8, Math.min(100, ((pct - min) / (max - min)) * 100));
  }

  saveCommissionBounds(): void {
    const mode = this.modeDraft();
    const global = {
      maxCommissionPct: this.globalMax(),
      minCommissionPct: this.globalMin(),
    };

    const perBundle: Record<string, PlatformCommissionBounds> = {};
    for (const bundle of this.activeBundles()) {
      perBundle[bundle.id] = { ...this.boundsForBundleDraft(bundle.id) };
    }

    this.store.updatePlatformCommissionConfig({
      mode,
      global,
      perBundle,
    });
    this.dirty.set(false);
    this.commissionModalOpen.set(false);
    this.toast.set(this.copy().saved);
    setTimeout(() => this.toast.set(null), 3000);
  }
}
