import { Component, computed, effect, inject, signal } from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideLayers,
  lucidePackage,
  lucideClock,
  lucideUsers,
  lucideSnowflake,
  lucideSlidersHorizontal,
  lucideSearch,
  lucideEye,
  lucidePencil,
  lucidePlus,
  lucideAward,
  lucideCalendarDays,
  lucideCircleCheck,
  lucideCircleX,
  lucideLink2,
  lucideArrowRight,
  lucideExternalLink,
  lucideBanknote,
  lucideChevronRight,
  lucideChevronDown,
  lucideSparkles,
  lucideTrendingDown,
  lucideCrown,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { AdminPermissions } from '@/core/auth/admin-permissions';
import { SUBSCRIPTIONS_I18N, TIER_LABELS } from '@/core/i18n/translations/subscriptions.i18n';
import { HasPermissionDirective } from '@/shared/directives/has-permission.directive';
import { MmTablePaginationComponent } from '@/shared/components/layout/table-pagination';
import { createTablePagination } from '@/shared/utils/table-pagination.util';
import { SubscriptionsStore } from '../../data/subscriptions-store';
import { RestaurantTier, TierAverageRow } from '../../models';
import { MmOperationsKpiCardComponent } from '@/shared/components/operations';
import { MmDetailToastComponent } from '@/shared/components/accounts';
import {
  CatalogEntityType,
  CatalogDrawerMode,
  CatalogItemDrawerComponent,
} from '../../components/catalog-item-drawer/catalog-item-drawer.component';

interface CustomerTierRow {
  id: RestaurantTier;
  tier: RestaurantTier;
  accessKey: 'tierAccessBasic' | 'tierAccessPlatinum' | 'tierAccessElite';
  pricingKey: 'pricingScopeBasic' | 'pricingScopePlatinum' | 'pricingScopeElite';
}

@Component({
  selector: 'mm-programs-workspace-page',
  standalone: true,
  imports: [
    DecimalPipe,
    NgClass,
    NgIcon,
    RouterLink,
    MmOperationsKpiCardComponent,
    MmDetailToastComponent,
    CatalogItemDrawerComponent,
    HasPermissionDirective,
    MmTablePaginationComponent,
  ],
  providers: [
    provideIcons({
      lucideLayers,
      lucidePackage,
      lucideClock,
      lucideUsers,
      lucideSnowflake,
      lucideSlidersHorizontal,
      lucideSearch,
      lucideEye,
      lucidePencil,
      lucidePlus,
      lucideAward,
      lucideCalendarDays,
      lucideCircleCheck,
      lucideCircleX,
      lucideLink2,
      lucideArrowRight,
      lucideExternalLink,
      lucideBanknote,
      lucideChevronRight,
      lucideChevronDown,
      lucideSparkles,
      lucideTrendingDown,
      lucideCrown,
    }),
  ],
  templateUrl: './programs-workspace-page.component.html',
  host: { class: 'block' },
})
export class ProgramsWorkspacePageComponent {
  readonly locale = inject(AppLocaleService);
  readonly store = inject(SubscriptionsStore);
  readonly perms = AdminPermissions;

  readonly copy = computed(() => SUBSCRIPTIONS_I18N[this.locale.locale()]);
  readonly searchQuery = signal('');
  readonly statusFilter = signal<'all' | 'active' | 'inactive'>('all');
  readonly toast = signal<string | null>(null);

  readonly selectedProgramId = signal<string | null>(null);
  readonly selectedBundleId = signal<string | null>(null);
  readonly manageSection = signal<'durations' | 'programs' | 'bundles'>('programs');
  readonly catalogExpanded = signal(false);

  readonly drawerOpen = signal(false);
  readonly drawerEntity = signal<CatalogEntityType>('program');
  readonly drawerMode = signal<CatalogDrawerMode>('view');
  readonly drawerItemId = signal<string | null>(null);
  readonly pg = createTablePagination(5);
  readonly currentPage = this.pg.currentPage;
  readonly pageSize = this.pg.pageSize;

  readonly stats = computed(() => this.store.stats());
  readonly readinessGaps = computed(() => this.store.readinessGaps());

  readonly kpis = computed(() => ({
    programs: this.store.programs().filter((p) => p.status === 'active').length,
    bundles: this.store.bundles().filter((b) => b.status === 'active').length,
    awaiting: this.readinessGaps().length,
    activeSubs: this.stats().activeSubscriptions,
    frozen: this.stats().frozenSubscriptions,
    custom: this.stats().customDurationCount,
  }));

  readonly filteredPrograms = computed(() => {
    let rows = this.store.programs();
    const q = this.searchQuery().toLowerCase().trim();
    const st = this.statusFilter();
    if (st !== 'all') {
      rows = rows.filter((r) => (st === 'active' ? r.status === 'active' : r.status !== 'active'));
    }
    if (q) {
      rows = rows.filter(
        (r) =>
          r.nameAr.toLowerCase().includes(q) ||
          r.nameEn.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q),
      );
    }
    return rows;
  });

  readonly filteredBundles = computed(() => {
    let rows = this.store.bundles();
    const q = this.searchQuery().toLowerCase().trim();
    if (q) {
      rows = rows.filter(
        (r) =>
          r.nameAr.toLowerCase().includes(q) ||
          r.nameEn.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q),
      );
    }
    return rows;
  });

  readonly customerTiers: CustomerTierRow[] = [
    { id: 'basic', tier: 'basic', accessKey: 'tierAccessBasic', pricingKey: 'pricingScopeBasic' },
    { id: 'platinum', tier: 'platinum', accessKey: 'tierAccessPlatinum', pricingKey: 'pricingScopePlatinum' },
    { id: 'elite', tier: 'elite', accessKey: 'tierAccessElite', pricingKey: 'pricingScopeElite' },
  ];

  readonly effectiveProgramId = computed(() => {
    const selected = this.selectedProgramId();
    const programs = this.filteredPrograms();
    if (selected && programs.some((p) => p.id === selected)) return selected;
    return programs[0]?.id ?? null;
  });

  readonly selectedProgram = computed(() => {
    const id = this.effectiveProgramId();
    if (!id) return null;
    return this.store.programs().find((p) => p.id === id) ?? null;
  });

  readonly bundlesForProgram = computed(() => {
    const programId = this.effectiveProgramId();
    if (!programId) return [];
    return this.store.getBundlePricingForProgram(programId);
  });

  readonly effectiveBundleId = computed(() => {
    const selected = this.selectedBundleId();
    const bundles = this.bundlesForProgram();
    if (selected && bundles.some((b) => b.bundleId === selected)) return selected;
    return bundles[0]?.bundleId ?? null;
  });

  readonly selectedBundleLink = computed(() => {
    const bundleId = this.effectiveBundleId();
    if (!bundleId) return null;
    return this.bundlesForProgram().find((b) => b.bundleId === bundleId) ?? null;
  });

  readonly tierPricesForSelection = computed(() => {
    const programId = this.effectiveProgramId();
    const bundleId = this.effectiveBundleId();
    if (!programId || !bundleId) return [];
    const order: RestaurantTier[] = ['basic', 'platinum', 'elite'];
    const rows = this.store
      .tierAverages()
      .filter((r) => r.programId === programId && r.bundleId === bundleId);
    return rows.sort((a, b) => order.indexOf(a.tier) - order.indexOf(b.tier));
  });

  readonly activeDurations = computed(() =>
    this.store.durations().filter((d) => d.status === 'active'),
  );

  readonly manageRows = computed(() => {
    const section = this.manageSection();
    if (section === 'durations') return this.store.durations();
    if (section === 'programs') return this.filteredPrograms();
    return this.filteredBundles();
  });

  readonly paginatedDurationsManage = this.pg.paginated(computed(() => this.store.durations()));
  readonly paginatedProgramsManage = this.pg.paginated(this.filteredPrograms);
  readonly paginatedBundlesManage = this.pg.paginated(this.filteredBundles);
  readonly totalPages = this.pg.totalPages(this.manageRows);
  readonly paginationItems = computed(() => {
    const section = this.manageSection();
    if (section === 'durations') return this.locale.isRtl() ? 'مدة' : 'durations';
    if (section === 'programs') return this.locale.isRtl() ? 'برنامج' : 'programs';
    return this.locale.isRtl() ? 'باقة' : 'bundles';
  });

  readonly breadcrumbLabel = computed(() => {
    const program = this.selectedProgram();
    const bundle = this.selectedBundleLink();
    if (!program) return '';
    const programName = this.programName(program);
    if (!bundle) return programName;
    const bundleName = this.locale.isRtl() ? bundle.nameAr : bundle.nameEn;
    return `${programName} → ${bundleName}`;
  });

  readonly selectionSummary = computed(() => {
    const prices = this.tierPricesForSelection();
    if (!prices.length) return null;
    const values = prices.map((r) => r.customerPrice26DaysKd);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const bundle = this.selectedBundleLink();
    return {
      tierCount: prices.length,
      restaurantTotal: prices.reduce((sum, r) => sum + r.restaurantCount, 0),
      priced: bundle?.priced ?? false,
      minPrice26: min,
      maxPrice26: max,
    };
  });

  readonly maxDurationCommission = computed(() => {
    const durations = this.activeDurations();
    if (!durations.length) return 30;
    return Math.max(...durations.map((d) => d.commissionAtDays));
  });

  constructor() {
    effect(() => {
      const programs = this.filteredPrograms();
      const current = this.selectedProgramId();
      if (!programs.length) {
        this.selectedProgramId.set(null);
        return;
      }
      if (!current || !programs.some((p) => p.id === current)) {
        this.selectedProgramId.set(programs[0].id);
      }
    });

    effect(() => {
      const bundles = this.bundlesForProgram();
      const current = this.selectedBundleId();
      if (!bundles.length) {
        this.selectedBundleId.set(null);
        return;
      }
      if (!current || !bundles.some((b) => b.bundleId === current)) {
        this.selectedBundleId.set(bundles[0].bundleId);
      }
    });
  }

  selectProgram(id: string): void {
    this.selectedProgramId.set(id);
    this.selectedBundleId.set(null);
  }

  selectBundle(id: string): void {
    this.selectedBundleId.set(id);
  }

  selectBundleFromCatalog(bundleId: string): void {
    const links = this.store.getProgramsForBundle(bundleId);
    const linked = links.find((l) => l.priced) ?? links[0];
    if (linked) {
      this.selectedProgramId.set(linked.programId);
    }
    this.selectedBundleId.set(bundleId);
  }

  setManageSection(section: 'durations' | 'programs' | 'bundles'): void {
    this.manageSection.set(section);
    this.pg.resetPage();
  }

  tierLabel(tier: RestaurantTier): string {
    return TIER_LABELS[this.locale.locale()][tier] ?? tier;
  }

  tierBadgeClass(tier: RestaurantTier): string {
    if (tier === 'elite') return 'bg-amber-50 text-amber-800 ring-amber-600/20';
    if (tier === 'platinum') return 'bg-violet-50 text-violet-700 ring-violet-600/20';
    return 'bg-slate-100 text-slate-700 ring-slate-600/20';
  }

  tierPriceCardClass(tier: RestaurantTier): string {
    if (tier === 'elite') return 'border-amber-200/80 bg-gradient-to-b from-amber-50/80 to-white';
    if (tier === 'platinum') return 'border-violet-200/80 bg-gradient-to-b from-violet-50/80 to-white';
    return 'border-slate-200/80 bg-gradient-to-b from-slate-50/80 to-white';
  }

  tierPriceHeroClass(tier: RestaurantTier): string {
    if (tier === 'elite') return 'text-amber-900';
    if (tier === 'platinum') return 'text-violet-900';
    return 'text-slate-900';
  }

  tierAccentBarClass(tier: RestaurantTier): string {
    if (tier === 'elite') return 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600';
    if (tier === 'platinum') return 'bg-gradient-to-r from-violet-400 via-violet-500 to-violet-600';
    return 'bg-gradient-to-r from-slate-300 via-slate-400 to-slate-500';
  }

  tierIconName(tier: RestaurantTier): string {
    if (tier === 'elite') return 'lucideCrown';
    if (tier === 'platinum') return 'lucideSparkles';
    return 'lucideAward';
  }

  tierIconWrapClass(tier: RestaurantTier): string {
    if (tier === 'elite') return 'bg-amber-100 text-amber-700 ring-amber-200';
    if (tier === 'platinum') return 'bg-violet-100 text-violet-700 ring-violet-200';
    return 'bg-slate-100 text-slate-600 ring-slate-200';
  }

  isFeaturedTier(tier: RestaurantTier): boolean {
    return tier === 'platinum';
  }

  commissionBarWidth(commission: number): number {
    const max = this.maxDurationCommission();
    if (!max) return 0;
    return Math.max(12, Math.round((commission / max) * 100));
  }

  toggleCatalog(): void {
    this.catalogExpanded.update((v) => !v);
  }

  workflowStep(): 1 | 2 | 3 {
    if (!this.effectiveProgramId()) return 1;
    if (!this.effectiveBundleId()) return 2;
    return 3;
  }

  tierAccess(row: CustomerTierRow): string {
    return this.copy()[row.accessKey];
  }

  tierPricingScope(row: CustomerTierRow): string {
    return this.copy()[row.pricingKey];
  }

  programName(p: { nameAr: string; nameEn: string }): string {
    return this.locale.isRtl() ? p.nameAr : p.nameEn;
  }

  statusLabel(status: string): string {
    const c = this.copy();
    if (status === 'active') return c.active;
    if (status === 'hidden_for_new') return c.hiddenForNew;
    return c.inactive;
  }

  bundleComponentsLabel(components: {
    breakfast: boolean;
    mainMeals: number;
    snack: boolean;
    salad: boolean;
  }): string {
    const c = this.copy();
    const parts: string[] = [];
    if (components.breakfast) parts.push(c.componentBreakfast);
    if (components.mainMeals) parts.push(`${components.mainMeals} ${c.componentMain}`);
    if (components.snack) parts.push(c.componentSnack);
    if (components.salad) parts.push(c.componentSalad);
    return parts.join(' · ');
  }

  durationDaysLabel(d: { isCustom: boolean; days: number }): string {
    const c = this.copy();
    return d.isCustom ? c.customDurationLabel : `${d.days} ${c.days}`;
  }

  openCreate(entity: CatalogEntityType): void {
    this.drawerEntity.set(entity);
    this.drawerMode.set('create');
    this.drawerItemId.set(null);
    this.drawerOpen.set(true);
  }

  openView(entity: CatalogEntityType, id: string): void {
    this.drawerEntity.set(entity);
    this.drawerMode.set('view');
    this.drawerItemId.set(id);
    this.drawerOpen.set(true);
  }

  openEdit(entity: CatalogEntityType, id: string): void {
    this.drawerEntity.set(entity);
    this.drawerMode.set('edit');
    this.drawerItemId.set(id);
    this.drawerOpen.set(true);
  }

  closeDrawer(): void {
    this.drawerOpen.set(false);
  }

  onDrawerEditRequested(): void {
    this.drawerMode.set('edit');
  }

  onDrawerSaved(msg: string): void {
    this.showToast(msg);
    this.closeDrawer();
  }

  onDrawerDeleted(): void {
    this.closeDrawer();
  }

  onDrawerMessage(msg: string): void {
    this.showToast(msg);
    this.closeDrawer();
  }

  toggleDuration(id: string): void {
    this.store.toggleDuration(id);
    this.showToast(this.copy().saved);
  }

  savePublish(): void {
    this.showToast(this.copy().saved);
  }

  private showToast(message: string): void {
    this.toast.set(message);
    setTimeout(() => this.toast.set(null), 3000);
  }

  onPageChange(page: number): void {
    this.pg.onPageChange(page, this.totalPages());
  }
}
