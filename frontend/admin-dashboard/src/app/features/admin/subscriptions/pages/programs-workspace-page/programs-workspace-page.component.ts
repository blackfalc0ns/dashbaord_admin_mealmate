import { Component, computed, inject, signal } from '@angular/core';
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
  lucidePencil,
  lucidePlus,
  lucideCheck,
  lucideShieldAlert,
  lucideCircleAlert,
  lucideArrowRight,
  lucideArrowLeft,
  lucidePercent,
  lucideChefHat,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { AdminPermissions } from '@/core/auth/admin-permissions';
import { SUBSCRIPTIONS_I18N, TIER_LABELS } from '@/core/i18n/translations/subscriptions.i18n';
import { HasPermissionDirective } from '@/shared/directives/has-permission.directive';
import { SubscriptionsStore } from '../../data/subscriptions-store';
import { RestaurantTier } from '../../models';
import { MmOperationsKpiCardComponent } from '@/shared/components/operations';
import { MmDetailToastComponent } from '@/shared/components/accounts';
import {
  CatalogEntityType,
  CatalogDrawerMode,
  CatalogItemDrawerComponent,
} from '../../components/catalog-item-drawer/catalog-item-drawer.component';

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
      lucidePencil,
      lucidePlus,
      lucideCheck,
      lucideShieldAlert,
      lucideCircleAlert,
      lucideArrowRight,
      lucideArrowLeft,
      lucidePercent,
      lucideChefHat,
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

  // Modern Unified Workspace Program Selector
  readonly selectedProgramId = signal<string | null>('PRG-001');

  readonly drawerOpen = signal(false);
  readonly drawerEntity = signal<CatalogEntityType>('program');
  readonly drawerMode = signal<CatalogDrawerMode>('view');
  readonly drawerItemId = signal<string | null>(null);

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

  readonly selectedProgram = computed(() => {
    const id = this.selectedProgramId();
    return this.store.programs().find((p) => p.id === id) || null;
  });

  readonly selectedProgramPricedRestaurants = computed(() => {
    const id = this.selectedProgramId();
    if (!id) return [];
    return this.store.getRestaurantsForProgram(id);
  });

  // Retrieves all tier averages (Basic, Platinum, Elite) for the currently selected program and a given bundle
  getAveragesForSelectedProgramAndBundle(bundleId: string) {
    const progId = this.selectedProgramId();
    if (!progId) return [];
    return this.store.tierAverages().filter((t) => t.programId === progId && t.bundleId === bundleId);
  }

  selectProgram(id: string): void {
    this.selectedProgramId.set(this.selectedProgramId() === id ? null : id);
  }

  // Check if a specific bundle is priced/ready for the selected program
  getBundleReadinessForSelectedProgram(bundleId: string): { priced: boolean; restaurantCount: number } {
    const progId = this.selectedProgramId();
    if (!progId) return { priced: false, restaurantCount: 0 };

    const prices = this.store.restaurantPrices().filter(
      (p) => p.programId === progId && p.bundleId === bundleId,
    );
    return {
      priced: prices.length > 0,
      restaurantCount: prices.length,
    };
  }

  // Overall readiness percentage for the selected program (0-100)
  readonly selectedProgramReadiness = computed(() => {
    const progId = this.selectedProgramId();
    if (!progId) return 0;
    const bundles = this.store.bundles();
    if (bundles.length === 0) return 0;
    const priced = bundles.filter((b) => {
      return this.store.restaurantPrices().some(
        (p) => p.programId === progId && p.bundleId === b.id,
      );
    }).length;
    return Math.round((priced / bundles.length) * 100);
  });

  tierLabel(tier: RestaurantTier): string {
    return TIER_LABELS[this.locale.locale()][tier] ?? tier;
  }

  tierBadgeClass(tier: RestaurantTier): string {
    if (tier === 'elite') return 'bg-amber-50 text-amber-800 ring-amber-600/20';
    if (tier === 'platinum') return 'bg-violet-50 text-violet-700 ring-violet-600/20';
    return 'bg-slate-100 text-slate-700 ring-slate-600/20';
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

  openCreateEntity(type: CatalogEntityType): void {
    this.drawerEntity.set(type);
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
}
