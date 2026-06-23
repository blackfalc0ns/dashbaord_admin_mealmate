import { Component, computed, inject, signal } from '@angular/core';
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
import { OperationsStateService } from '../../data/operations-state.service';
import { OrderWorkspaceView } from '../../models';
import { OrderQueueTableComponent, OrderActionType } from '../../components/orders/order-queue-table/order-queue-table.component';
import { OrderActionDrawerComponent } from '../../components/orders/order-action-drawer/order-action-drawer.component';
import { MmOperationsKpiCardComponent } from '@/shared/components/operations';

@Component({
  selector: 'mm-orders-workspace-page',
  standalone: true,
  imports: [
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
  readonly state = inject(OperationsStateService);
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

  closeDrawer(): void {
    this.drawerOrderId.set(null);
    this.drawerAction.set(null);
  }

  onActionCompleted(message: string): void {
    this.toast.set(message);
    setTimeout(() => this.toast.set(null), 3000);
  }
}
