import { Injectable, computed, signal } from '@angular/core';
import {
  BundleComponents,
  CatalogStatus,
  ClassificationRow,
  MealBundle,
  NutritionProgram,
  OutlierActionType,
  OutlierAuditLog,
  PlatformCommissionBounds,
  PlatformCommissionConfig,
  PlatformCommissionMode,
  ProfitabilityAlert,
  RecalculationEvent,
  RestaurantCommissionRow,
  RestaurantPriceRow,
  RestaurantTier,
  SingleRestaurantBounds,
  SubscriptionDuration,
  TierAverageRow,
} from '../models';
import {
  classifyTier,
  commissionPct,
  customerBasePrice,
  dailyPriceFrom26,
  expectedProfitKd,
  isOutlier,
  mean,
  netProfitPct,
  stdDev,
} from './subscription-formulas';
import {
  BUNDLES_MOCK,
  DEFAULT_SINGLE_BOUNDS,
  DURATIONS_MOCK,
  OUTLIER_AUDIT_MOCK,
  PLATFORM_COMMISSION_CONFIG_MOCK,
  PROGRAMS_MOCK,
  RECALCULATION_EVENTS_MOCK,
  RESTAURANT_COMMISSIONS_MOCK,
  RESTAURANT_PRICES_MOCK,
  SUBSCRIPTION_STATS_MOCK,
} from './subscriptions.mock';

@Injectable({ providedIn: 'root' })
export class SubscriptionsStateService {
  readonly durations = signal<SubscriptionDuration[]>([...DURATIONS_MOCK]);
  readonly programs = signal<NutritionProgram[]>([...PROGRAMS_MOCK]);
  readonly bundles = signal<MealBundle[]>([...BUNDLES_MOCK]);
  readonly restaurantPrices = signal<RestaurantPriceRow[]>([...RESTAURANT_PRICES_MOCK]);
  readonly platformCommissionConfig = signal<PlatformCommissionConfig>({
    ...PLATFORM_COMMISSION_CONFIG_MOCK,
    global: { ...PLATFORM_COMMISSION_CONFIG_MOCK.global },
    perBundle: { ...PLATFORM_COMMISSION_CONFIG_MOCK.perBundle },
  });

  readonly platformCommission = computed(() => this.platformCommissionConfig().global);
  readonly singleRestaurantBounds = signal<SingleRestaurantBounds>({ ...DEFAULT_SINGLE_BOUNDS });
  readonly restaurantCommissions = signal<RestaurantCommissionRow[]>([...RESTAURANT_COMMISSIONS_MOCK]);
  readonly outlierAudits = signal<OutlierAuditLog[]>([...OUTLIER_AUDIT_MOCK]);
  readonly recalculationEvents = signal<RecalculationEvent[]>([...RECALCULATION_EVENTS_MOCK]);
  readonly stats = signal({ ...SUBSCRIPTION_STATS_MOCK });

  readonly adminOverrides = signal<Record<string, RestaurantTier | 'excluded'>>({});

  readonly classifications = computed(() => this.buildClassifications());

  readonly tierAverages = computed(() => this.buildTierAverages());

  readonly profitabilityAlerts = computed(() => this.buildProfitabilityAlerts());

  readonly readinessGaps = computed(() => {
    const priced = new Set(
      this.restaurantPrices().map((p) => `${p.programId}:${p.bundleId}`),
    );
    const gaps: { programId: string; bundleId: string; programNameAr: string; programNameEn: string; bundleNameAr: string; bundleNameEn: string }[] = [];
    for (const program of this.programs()) {
      for (const bundle of this.bundles()) {
        if (!priced.has(`${program.id}:${bundle.id}`)) {
          gaps.push({
            programId: program.id,
            bundleId: bundle.id,
            programNameAr: program.nameAr,
            programNameEn: program.nameEn,
            bundleNameAr: bundle.nameAr,
            bundleNameEn: bundle.nameEn,
          });
        }
      }
    }
    return gaps;
  });

  readonly tierDistribution = computed(() => {
    const rows = this.classifications().filter((r) => !r.isExcluded);
    const total = rows.length || 1;
    const basic = rows.filter((r) => this.effectiveTier(r) === 'basic').length;
    const platinum = rows.filter((r) => this.effectiveTier(r) === 'platinum').length;
    const elite = rows.filter((r) => this.effectiveTier(r) === 'elite').length;
    return {
      basicPct: Math.round((basic / total) * 100),
      platinumPct: Math.round((platinum / total) * 100),
      elitePct: Math.round((elite / total) * 100),
      flagged: rows.filter((r) => r.isOutlier).length,
    };
  });

  boundsForBundle(bundleId: string): PlatformCommissionBounds {
    const cfg = this.platformCommissionConfig();
    if (cfg.mode === 'global') return cfg.global;
    return cfg.perBundle[bundleId] ?? cfg.global;
  }

  toggleDuration(id: string): void {
    this.durations.update((list) =>
      list.map((d) =>
        d.id === id
          ? {
              ...d,
              status: d.status === 'active' ? 'inactive' : 'active',
              updatedAt: new Date().toISOString(),
            }
          : d,
      ),
    );
  }

  getRestaurantsForProgram(programId: string): string[] {
    return [
      ...new Set(
        this.restaurantPrices()
          .filter((p) => p.programId === programId)
          .map((p) => p.restaurantName),
      ),
    ];
  }

  getBundlePricingForProgram(programId: string): { bundleId: string; nameAr: string; nameEn: string; priced: boolean; restaurantCount: number }[] {
    return this.bundles().map((b) => {
      const prices = this.restaurantPrices().filter(
        (p) => p.programId === programId && p.bundleId === b.id,
      );
      return {
        bundleId: b.id,
        nameAr: b.nameAr,
        nameEn: b.nameEn,
        priced: prices.length > 0,
        restaurantCount: prices.length,
      };
    });
  }

  getProgramsForBundle(bundleId: string): { programId: string; nameAr: string; nameEn: string; priced: boolean }[] {
    return this.programs().map((p) => {
      const priced = this.restaurantPrices().some(
        (r) => r.programId === p.id && r.bundleId === bundleId,
      );
      return { programId: p.id, nameAr: p.nameAr, nameEn: p.nameEn, priced };
    });
  }

  addDuration(
    input: Omit<SubscriptionDuration, 'id' | 'createdAt' | 'updatedAt' | 'commissionAtDays'> & {
      isCustom?: boolean;
    },
  ): SubscriptionDuration {
    const now = new Date().toISOString();
    const platform = this.platformCommissionConfig().global;
    const days = input.days || 1;
    const item: SubscriptionDuration = {
      ...input,
      id: `DUR-${Date.now()}`,
      isCustom: input.isCustom ?? true,
      commissionAtDays: commissionPct(days, platform.maxCommissionPct, platform.minCommissionPct),
      createdAt: now,
      updatedAt: now,
    };
    this.durations.update((list) => [...list, item]);
    return item;
  }

  updateDuration(id: string, patch: Partial<SubscriptionDuration>): void {
    const platform = this.platformCommissionConfig().global;
    this.durations.update((list) =>
      list.map((d) => {
        if (d.id !== id) return d;
        const days = patch.days ?? d.days;
        return {
          ...d,
          ...patch,
          commissionAtDays:
            patch.days !== undefined
              ? commissionPct(days, platform.maxCommissionPct, platform.minCommissionPct)
              : d.commissionAtDays,
          updatedAt: new Date().toISOString(),
        };
      }),
    );
  }

  removeDuration(id: string): 'deleted' | 'blocked' {
    const item = this.durations().find((d) => d.id === id);
    if (!item || !item.isCustom) return 'blocked';
    this.durations.update((list) => list.filter((d) => d.id !== id));
    return 'deleted';
  }

  addProgram(input: {
    nameAr: string;
    nameEn: string;
    descriptionAr: string;
    descriptionEn: string;
    status?: CatalogStatus;
  }): NutritionProgram {
    const now = new Date().toISOString();
    const item: NutritionProgram = {
      id: `PRG-${String(this.programs().length + 1).padStart(3, '0')}`,
      status: input.status ?? 'active',
      pricedRestaurantCount: 0,
      activeSubscriptionCount: 0,
      countryCode: 'KW',
      createdAt: now,
      updatedAt: now,
      ...input,
    };
    this.programs.update((list) => [...list, item]);
    return item;
  }

  updateProgram(id: string, patch: Partial<NutritionProgram>): void {
    this.programs.update((list) =>
      list.map((p) =>
        p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p,
      ),
    );
  }

  removeProgram(id: string): 'deleted' | 'hidden' {
    const item = this.programs().find((p) => p.id === id);
    if (!item) return 'deleted';
    if (item.activeSubscriptionCount > 0) {
      this.updateProgram(id, { status: 'hidden_for_new' });
      return 'hidden';
    }
    this.programs.update((list) => list.filter((p) => p.id !== id));
    this.restaurantPrices.update((list) => list.filter((p) => p.programId !== id));
    return 'deleted';
  }

  addBundle(input: {
    nameAr: string;
    nameEn: string;
    components: BundleComponents;
    isCustom?: boolean;
    status?: CatalogStatus;
  }): MealBundle {
    const now = new Date().toISOString();
    const item: MealBundle = {
      id: `BND-${String(this.bundles().length + 1).padStart(3, '0')}`,
      isCustom: input.isCustom ?? false,
      status: input.status ?? 'active',
      pricedRestaurantCount: 0,
      activeSubscriptionCount: 0,
      isReady: false,
      createdAt: now,
      updatedAt: now,
      nameAr: input.nameAr,
      nameEn: input.nameEn,
      components: input.components,
    };
    this.bundles.update((list) => [...list, item]);
    return item;
  }

  updateBundle(id: string, patch: Partial<MealBundle>): void {
    this.bundles.update((list) =>
      list.map((b) => {
        if (b.id !== id) return b;
        const next = { ...b, ...patch, updatedAt: new Date().toISOString() };
        const pricedCount = new Set(
          this.restaurantPrices().filter((p) => p.bundleId === id).map((p) => p.restaurantId),
        ).size;
        next.pricedRestaurantCount = pricedCount;
        next.isReady = pricedCount > 0;
        return next;
      }),
    );
  }

  removeBundle(id: string): 'deleted' | 'hidden' {
    const item = this.bundles().find((b) => b.id === id);
    if (!item) return 'deleted';
    if (item.activeSubscriptionCount > 0) {
      this.updateBundle(id, { status: 'hidden_for_new' });
      return 'hidden';
    }
    this.bundles.update((list) => list.filter((b) => b.id !== id));
    this.restaurantPrices.update((list) => list.filter((p) => p.bundleId !== id));
    return 'deleted';
  }

  updatePlatformCommission(bounds: PlatformCommissionBounds): void {
    this.updatePlatformCommissionConfig({ global: { ...bounds } });
  }

  updatePlatformCommissionConfig(patch: Partial<PlatformCommissionConfig>): void {
    this.platformCommissionConfig.update((cfg) => {
      const next: PlatformCommissionConfig = {
        ...cfg,
        ...patch,
        global: patch.global ? { ...patch.global } : cfg.global,
        perBundle: patch.perBundle ? { ...patch.perBundle } : cfg.perBundle,
      };
      return next;
    });
    this.recalcDurationCommissions();
    this.pushRecalcEvent('commission_change', 'تحديث حدود عمولة المنصة', 'Platform commission bounds updated');
  }

  setPlatformCommissionMode(mode: PlatformCommissionMode): void {
    this.updatePlatformCommissionConfig({ mode });
  }

  updateBundleCommissionBounds(bundleId: string, bounds: PlatformCommissionBounds): void {
    this.platformCommissionConfig.update((cfg) => ({
      ...cfg,
      perBundle: { ...cfg.perBundle, [bundleId]: { ...bounds } },
    }));
    this.pushRecalcEvent(
      'commission_change',
      `تحديث عمولة باقة ${bundleId}`,
      `Bundle ${bundleId} commission bounds updated`,
    );
  }

  private recalcDurationCommissions(): void {
    const { global } = this.platformCommissionConfig();
    this.durations.update((list) =>
      list.map((d) => {
        const days = d.isCustom ? d.days || 1 : d.days;
        return {
          ...d,
          commissionAtDays: commissionPct(days, global.maxCommissionPct, global.minCommissionPct),
        };
      }),
    );
  }

  updateSingleBounds(bounds: SingleRestaurantBounds): void {
    this.singleRestaurantBounds.set({ ...bounds });
    this.pushRecalcEvent('bounds_change', 'تعديل حدود التصنيف لمطعم واحد', 'Single-restaurant bounds updated');
  }

  updateRestaurantCommission(restaurantId: string, pct: number): void {
    this.restaurantCommissions.update((list) =>
      list.map((r) =>
        r.restaurantId === restaurantId
          ? { ...r, settlementCommissionPct: pct, updatedAt: new Date().toISOString() }
          : r,
      ),
    );
    this.restaurantPrices.update((list) =>
      list.map((p) =>
        p.restaurantId === restaurantId ? { ...p, restaurantSettlementCommissionPct: pct } : p,
      ),
    );
  }

  applyOutlierAction(
    row: ClassificationRow,
    action: OutlierActionType,
    reason: string,
  ): void {
    const key = this.rowKey(row);
    if (action === 'exclude') {
      this.adminOverrides.update((m) => ({ ...m, [key]: 'excluded' }));
    } else if (action === 'move_higher') {
      const next: RestaurantTier =
        row.tier === 'basic' ? 'platinum' : row.tier === 'platinum' ? 'elite' : 'elite';
      this.adminOverrides.update((m) => ({ ...m, [key]: next }));
    }
    this.outlierAudits.update((logs) => [
      {
        id: `OA-${Date.now()}`,
        restaurantId: row.restaurantId,
        restaurantName: row.restaurantName,
        programId: row.programId,
        bundleId: row.bundleId,
        action,
        reason,
        actorName: 'Admin — Current User',
        appliedAt: new Date().toISOString(),
      },
      ...logs,
    ]);
  }

  effectiveTier(row: ClassificationRow): RestaurantTier {
    const key = this.rowKey(row);
    const override = this.adminOverrides()[key];
    if (override === 'excluded') return row.tier;
    if (override) return override;
    return row.tier;
  }

  isRowExcluded(row: ClassificationRow): boolean {
    return this.adminOverrides()[this.rowKey(row)] === 'excluded';
  }

  private rowKey(row: Pick<ClassificationRow, 'restaurantId' | 'programId' | 'bundleId'>): string {
    return `${row.restaurantId}:${row.programId}:${row.bundleId}`;
  }

  private buildClassifications(): ClassificationRow[] {
    const bounds = this.singleRestaurantBounds();
    const prices = this.restaurantPrices();
    const overrides = this.adminOverrides();

    const groups = new Map<string, RestaurantPriceRow[]>();
    for (const p of prices) {
      const key = `${p.programId}:${p.bundleId}`;
      const list = groups.get(key) ?? [];
      list.push(p);
      groups.set(key, list);
    }

    const rows: ClassificationRow[] = [];

    for (const [, group] of groups) {
      const dailyPrices = group.map((p) => dailyPriceFrom26(p.price26DaysKd));
      const m = mean(dailyPrices);
      const s = stdDev(dailyPrices);

      for (const p of group) {
        const daily = dailyPriceFrom26(p.price26DaysKd);
        const tier = classifyTier(daily, dailyPrices, bounds);
        const tierAvgDaily = this.tierAvgDailyForRow(p, tier, groups, bounds);
        const comm26 = commissionPct(
          26,
          this.boundsForBundle(p.bundleId).maxCommissionPct,
          this.boundsForBundle(p.bundleId).minCommissionPct,
        );
        const customerDaily = tierAvgDaily * (1 + comm26 / 100);
        const outlierFlag = isOutlier(daily, dailyPrices, customerDaily, p.restaurantSettlementCommissionPct);
        const key = `${p.restaurantId}:${p.programId}:${p.bundleId}`;
        const override = overrides[key];

        rows.push({
          restaurantId: p.restaurantId,
          restaurantName: p.restaurantName,
          programId: p.programId,
          programNameAr: p.programNameAr,
          programNameEn: p.programNameEn,
          bundleId: p.bundleId,
          bundleNameAr: p.bundleNameAr,
          bundleNameEn: p.bundleNameEn,
          price26DaysKd: p.price26DaysKd,
          dailyPriceKd: daily,
          meanKd: m,
          stdDevKd: s,
          tier,
          restaurantCountInGroup: group.length,
          isOutlier: outlierFlag,
          expectedProfitKd: expectedProfitKd(
            customerDaily,
            daily,
            p.restaurantSettlementCommissionPct,
          ),
          customerDailyPriceKd: customerDaily,
          adminOverrideTier: override && override !== 'excluded' ? override : null,
          isExcluded: override === 'excluded',
        });
      }
    }

    return rows.sort((a, b) => a.restaurantName.localeCompare(b.restaurantName));
  }

  private tierAvgDailyForRow(
    p: RestaurantPriceRow,
    tier: RestaurantTier,
    groups: Map<string, RestaurantPriceRow[]>,
    bounds: SingleRestaurantBounds,
  ): number {
    const allRows: number[] = [];
    for (const [, group] of groups) {
      const dailyPrices = group.map((x) => dailyPriceFrom26(x.price26DaysKd));
      for (const item of group) {
        const d = dailyPriceFrom26(item.price26DaysKd);
        const t = classifyTier(d, dailyPrices, bounds);
        if (t === tier) allRows.push(d);
      }
    }
    return allRows.length ? mean(allRows) : dailyPriceFrom26(p.price26DaysKd);
  }

  private buildTierAverages(): TierAverageRow[] {
    const rows = this.classifications().filter((r) => !r.isExcluded);
    const map = new Map<string, ClassificationRow[]>();

    for (const r of rows) {
      const tier = this.effectiveTier(r);
      const key = `${r.programId}:${r.bundleId}:${tier}`;
      const list = map.get(key) ?? [];
      list.push({ ...r, tier });
      map.set(key, list);
    }

    const result: TierAverageRow[] = [];
    for (const [, group] of map) {
      const first = group[0];
      const avg26 = mean(group.map((g) => g.price26DaysKd));
      const avgDaily = mean(group.map((g) => g.dailyPriceKd));
      const bundleBounds = this.boundsForBundle(first.bundleId);
      const c6 = commissionPct(6, bundleBounds.maxCommissionPct, bundleBounds.minCommissionPct);
      const c12 = commissionPct(12, bundleBounds.maxCommissionPct, bundleBounds.minCommissionPct);
      const c26 = commissionPct(26, bundleBounds.maxCommissionPct, bundleBounds.minCommissionPct);

      result.push({
        programId: first.programId,
        programNameAr: first.programNameAr,
        programNameEn: first.programNameEn,
        bundleId: first.bundleId,
        bundleNameAr: first.bundleNameAr,
        bundleNameEn: first.bundleNameEn,
        tier: first.tier,
        restaurantCount: group.length,
        avgPrice26DaysKd: avg26,
        avgDailyPriceKd: avgDaily,
        customerPrice6DaysKd: customerBasePrice(avgDaily, 6, c6),
        customerPrice12DaysKd: customerBasePrice(avgDaily, 12, c12),
        customerPrice26DaysKd: customerBasePrice(avgDaily, 26, c26),
        commission6Pct: c6,
        commission12Pct: c12,
        commission26Pct: c26,
      });
    }

    return result.sort((a, b) =>
      `${a.programId}${a.bundleId}${a.tier}`.localeCompare(`${b.programId}${b.bundleId}${b.tier}`),
    );
  }

  private buildProfitabilityAlerts(): ProfitabilityAlert[] {
    const alerts: ProfitabilityAlert[] = [];
    const cutting = this.tierAverages().find(
      (t) => t.programId === 'PRG-001' && t.bundleId === 'BND-001' && t.tier === 'platinum',
    );
    if (cutting) {
      const restaurantCost = cutting.avgPrice26DaysKd;
      const customerPrice = cutting.customerPrice26DaysKd;
      const profit = netProfitPct(customerPrice, restaurantCost);
      if (profit < 10) {
        alerts.push({
          id: 'PA-001',
          severity: 'warning',
          programId: 'PRG-001',
          programNameAr: 'رشاقة',
          programNameEn: 'Cutting',
          bundleId: 'BND-001',
          bundleNameAr: 'باقة كاملة',
          bundleNameEn: 'Full bundle',
          netProfitPct: Number(profit.toFixed(1)),
          messageAr: `ربح برنامج التنشيف Platinum عند ${profit.toFixed(1)}% — أقل من 10%`,
          messageEn: `Cutting Platinum profit at ${profit.toFixed(1)}% — below 10% threshold`,
        });
      }
    }

    for (const row of this.classifications()) {
      if (row.isOutlier && !row.isExcluded) {
        alerts.push({
          id: `PA-OUT-${row.restaurantId}-${row.programId}`,
          severity: 'danger',
          programId: row.programId,
          programNameAr: row.programNameAr,
          programNameEn: row.programNameEn,
          bundleId: row.bundleId,
          bundleNameAr: row.bundleNameAr,
          bundleNameEn: row.bundleNameEn,
          netProfitPct: 0,
          messageAr: `${row.restaurantName}: ربح متوقع ${row.expectedProfitKd.toFixed(3)} د.ك/يوم — يحتاج مراجعة`,
          messageEn: `${row.restaurantName}: expected profit ${row.expectedProfitKd.toFixed(3)} KD/day — needs review`,
          restaurantId: row.restaurantId,
          restaurantName: row.restaurantName,
        });
      }
    }

    return alerts;
  }

  private pushRecalcEvent(
    type: RecalculationEvent['type'],
    summaryAr: string,
    summaryEn: string,
  ): void {
    this.recalculationEvents.update((events) => [
      {
        id: `RC-${Date.now()}`,
        type,
        summaryAr,
        summaryEn,
        at: new Date().toISOString(),
      },
      ...events.slice(0, 9),
    ]);
  }
}
