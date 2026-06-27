import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';
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
  lucideTrash2,
  lucidePlus,
  lucideAward,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { AdminPermissions } from '@/core/auth/admin-permissions';
import { SUBSCRIPTIONS_I18N, TIER_LABELS } from '@/core/i18n/translations/subscriptions.i18n';
import { HasPermissionDirective } from '@/shared/directives/has-permission.directive';
import { MmTablePaginationComponent } from '@/shared/components/layout/table-pagination';
import { createTablePagination } from '@/shared/utils/table-pagination.util';
import { SubscriptionsStore } from '../../data/subscriptions-store';
import { RestaurantTier } from '../../models';
import { MmOperationsKpiCardComponent } from '@/shared/components/operations';
import { MmDetailToastComponent } from '@/shared/components/accounts';
import {
  CatalogEntityType,
  CatalogDrawerMode,
  CatalogItemDrawerComponent,
} from '../../components/catalog-item-drawer/catalog-item-drawer.component';

type ProgramsTab = 'durations' | 'programs' | 'tiers' | 'mealBundles';

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
      lucideTrash2,
      lucidePlus,
      lucideAward,
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
  readonly activeTab = signal<ProgramsTab>('durations');
  readonly searchQuery = signal('');
  readonly statusFilter = signal<'all' | 'active' | 'inactive'>('all');
  readonly toast = signal<string | null>(null);

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

  readonly filteredTiers = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.customerTiers;
    return this.customerTiers.filter((row) => {
      const label = this.tierLabel(row.tier).toLowerCase();
      const access = this.copy()[row.accessKey].toLowerCase();
      const pricing = this.copy()[row.pricingKey].toLowerCase();
      return label.includes(q) || access.includes(q) || pricing.includes(q) || row.tier.includes(q);
    });
  });

  readonly activeTableRows = computed(() => {
    const tab = this.activeTab();
    if (tab === 'durations') return this.store.durations();
    if (tab === 'programs') return this.filteredPrograms();
    if (tab === 'tiers') return this.filteredTiers();
    return this.filteredBundles();
  });

  readonly paginatedDurations = this.pg.paginated(computed(() => this.store.durations()));
  readonly paginatedPrograms = this.pg.paginated(this.filteredPrograms);
  readonly paginatedTiers = this.pg.paginated(this.filteredTiers);
  readonly paginatedMealBundles = this.pg.paginated(this.filteredBundles);
  readonly totalPages = this.pg.totalPages(this.activeTableRows);
  readonly paginationItems = computed(() => {
    const tab = this.activeTab();
    if (tab === 'durations') return this.locale.isRtl() ? 'مدة' : 'durations';
    if (tab === 'programs') return this.locale.isRtl() ? 'برنامج' : 'programs';
    if (tab === 'tiers') return this.locale.isRtl() ? 'تصنيف' : 'tiers';
    return this.locale.isRtl() ? 'باقة وجبات' : 'meal bundles';
  });

  readonly addLabel = computed(() => {
    const c = this.copy();
    const tab = this.activeTab();
    if (tab === 'programs') return c.addProgram;
    if (tab === 'mealBundles') return c.addBundle;
    if (tab === 'durations') return c.addDuration;
    return '';
  });

  readonly showCreateActions = computed(() => this.activeTab() !== 'tiers');

  setTab(tab: ProgramsTab): void {
    this.activeTab.set(tab);
    this.pg.resetPage();
    if (tab === 'durations') {
      this.searchQuery.set('');
    }
  }

  tierLabel(tier: RestaurantTier): string {
    return TIER_LABELS[this.locale.locale()][tier] ?? tier;
  }

  tierBadgeClass(tier: RestaurantTier): string {
    if (tier === 'elite') return 'bg-amber-50 text-amber-800 ring-amber-600/20';
    if (tier === 'platinum') return 'bg-violet-50 text-violet-700 ring-violet-600/20';
    return 'bg-slate-100 text-slate-700 ring-slate-600/20';
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

  openCreate(): void {
    const tab = this.activeTab();
    this.drawerEntity.set(tab === 'durations' ? 'duration' : tab === 'mealBundles' ? 'bundle' : 'program');
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
