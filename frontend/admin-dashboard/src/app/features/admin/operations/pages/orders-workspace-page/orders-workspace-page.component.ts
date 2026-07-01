import { Component, computed, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideSearch,
  lucideCircleAlert,
  lucideClock,
  lucideRefreshCw,
  lucidePackage,
  lucideLayoutDashboard,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { OPERATIONS_I18N } from '@/core/i18n/translations/operations.i18n';
import { OperationsStore } from '../../data/operations-store';
import { OrderWorkspaceView } from '../../models';
import { OrderQueueTableComponent, OrderActionType } from '../../components/orders/order-queue-table/order-queue-table.component';
import { OrderActionDrawerComponent } from '../../components/orders/order-action-drawer/order-action-drawer.component';
import { MmOperationsKpiCardComponent } from '@/shared/components/operations';

@Component({
  selector: 'mm-orders-workspace-page',
  standalone: true,
  imports: [
    NgClass,
    NgIcon,
    OrderQueueTableComponent,
    OrderActionDrawerComponent,
    MmOperationsKpiCardComponent,
  ],
  providers: [
    provideIcons({
      lucideSearch,
      lucideCircleAlert,
      lucideClock,
      lucideRefreshCw,
      lucidePackage,
      lucideLayoutDashboard,
    }),
  ],
  templateUrl: './orders-workspace-page.component.html',
  host: { class: 'block' },
})
export class OrdersWorkspacePageComponent {
  readonly locale = inject(AppLocaleService);
  readonly state = inject(OperationsStore);
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);

  readonly copy = computed(() => OPERATIONS_I18N[this.locale.locale()]);
  readonly searchQuery = signal('');
  readonly activeView = signal<OrderWorkspaceView>('needs-action');
  readonly drawerOrderId = signal<string | null>(null);
  readonly drawerAction = signal<OrderActionType | null>(null);
  readonly toast = signal<string | null>(null);

  readonly kpis = computed(() => ({
    needsAction: this.state.filterByView('needs-action').length,
    confirmation: this.state.filterByView('confirmation').length,
    replacement: this.state.filterByView('replacement').length,
    prep: this.state.filterByView('prep').length,
    all: this.state.allOrders().length,
  }));

  readonly filteredRows = computed(() => {
    let rows = this.state.filterByView(this.activeView());
    const q = this.searchQuery().toLowerCase().trim();
    if (q) {
      rows = rows.filter(
        (r) =>
          r.orderId.toLowerCase().includes(q) ||
          r.customerDisplayName.toLowerCase().includes(q) ||
          r.restaurantName.toLowerCase().includes(q),
      );
    }
    return rows;
  });

  readonly emptyMessage = computed(() =>
    this.activeView() === 'needs-action' ? this.copy().noOrdersNeedsAction : this.copy().noOrders,
  );

  readonly orderItemLabel = computed(() => (this.locale.isRtl() ? 'طلب' : 'orders'));

  readonly viewFilters: { id: OrderWorkspaceView; countKey: 'all' | 'needsAction' | 'confirmation' | 'replacement' | 'prep' }[] = [
    { id: 'all', countKey: 'all' },
    { id: 'needs-action', countKey: 'needsAction' },
    { id: 'confirmation', countKey: 'confirmation' },
    { id: 'replacement', countKey: 'replacement' },
    { id: 'prep', countKey: 'prep' },
  ];

  viewLabel(id: OrderWorkspaceView): string {
    const c = this.copy();
    switch (id) {
      case 'all':
        return c.todayOrders;
      case 'needs-action':
        return c.needsAction;
      case 'confirmation':
        return c.awaitingConfirm;
      case 'replacement':
        return c.replacement;
      case 'prep':
        return c.prep24;
    }
  }

  viewChipActiveClass(id: OrderWorkspaceView): string {
    switch (id) {
      case 'needs-action':
        return 'bg-rose-100 text-rose-800 shadow-sm ring-1 ring-rose-300';
      case 'confirmation':
        return 'bg-amber-100 text-amber-800 shadow-sm ring-1 ring-amber-300';
      case 'replacement':
        return 'bg-violet-100 text-violet-800 shadow-sm ring-1 ring-violet-300';
      case 'prep':
        return 'bg-sky-100 text-sky-800 shadow-sm ring-1 ring-sky-300';
      default:
        return 'bg-slate-100 text-slate-800 shadow-sm';
    }
  }

  constructor() {
    this.route.queryParamMap.subscribe((params) => {
      const view = params.get('view') as OrderWorkspaceView | null;
      if (
        view &&
        ['needs-action', 'all', 'confirmation', 'replacement', 'prep'].includes(view)
      ) {
        this.activeView.set(view);
      }
    });
  }

  setView(view: OrderWorkspaceView): void {
    this.activeView.set(view);
    this.searchQuery.set('');
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { view },
      queryParamsHandling: 'merge',
    });
  }

  onAction(event: { orderId: string; action: OrderActionType }): void {
    this.drawerOrderId.set(event.orderId);
    this.drawerAction.set(event.action);
  }

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  closeDrawer(): void {
    this.drawerOrderId.set(null);
    this.drawerAction.set(null);
  }

  onActionCompleted(message: string): void {
    this.toast.set(message);
    setTimeout(() => this.toast.set(null), 3000);
  }
}
