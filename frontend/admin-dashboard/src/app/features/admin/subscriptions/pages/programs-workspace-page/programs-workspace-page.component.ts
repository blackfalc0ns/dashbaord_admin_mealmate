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
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { AdminPermissions } from '@/core/auth/admin-permissions';
import { SUBSCRIPTIONS_I18N } from '@/core/i18n/translations/subscriptions.i18n';
import { HasPermissionDirective } from '@/shared/directives/has-permission.directive';
import { SubscriptionsStore } from '../../data/subscriptions-store';
import { MmOperationsKpiCardComponent } from '@/shared/components/operations';
import { MmDetailToastComponent } from '@/shared/components/accounts';
import {
  CatalogEntityType,
  CatalogDrawerMode,
  CatalogItemDrawerComponent,
} from '../../components/catalog-item-drawer/catalog-item-drawer.component';

type ProgramsTab = 'durations' | 'programs' | 'bundles';

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

  readonly addLabel = computed(() => {
    const c = this.copy();
    const tab = this.activeTab();
    if (tab === 'programs') return c.addProgram;
    if (tab === 'bundles') return c.addBundle;
    return c.addDuration;
  });

  setTab(tab: ProgramsTab): void {
    this.activeTab.set(tab);
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
    this.drawerEntity.set(tab === 'durations' ? 'duration' : tab === 'bundles' ? 'bundle' : 'program');
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
