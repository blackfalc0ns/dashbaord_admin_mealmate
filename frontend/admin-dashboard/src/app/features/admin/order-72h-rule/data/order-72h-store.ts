import { Injectable, computed, signal } from '@angular/core';
import { PageStateModel } from '@/shared/models/page-view-state.model';
import {
  Order72hPhase,
  ReplacementWindowStatus,
  RestaurantConfirmationStatus,
} from '../models/order-72h.enums';
import { AdminOrder72hRow } from '../models/admin-order-72h.model';
import { ReplacementWindowRow } from '../models/replacement-window.model';
import { Preparation24hRow } from '../models/preparation-24h.model';
import { OrderExceptionLog } from '../models/order-exception-log.model';
import {
  ORDER_72H_MOCK_ROWS,
  ORDER_EXCEPTION_LOGS_MOCK,
  PREPARATION_24H_MOCK,
  REPLACEMENT_WINDOW_MOCK,
} from './order-72h.mock';

/** Signal store for F121 72h operations — single source of truth for F06 pages. */
@Injectable({ providedIn: 'root' })
export class Order72hStore {
  readonly page = signal<PageStateModel>({ viewState: 'idle' });
  readonly allOrders = signal<AdminOrder72hRow[]>([...ORDER_72H_MOCK_ROWS]);
  readonly replacementWindows = signal<ReplacementWindowRow[]>([...REPLACEMENT_WINDOW_MOCK]);
  readonly preparationRows = signal<Preparation24hRow[]>([...PREPARATION_24H_MOCK]);
  readonly exceptionLogs = signal<OrderExceptionLog[]>([...ORDER_EXCEPTION_LOGS_MOCK]);

  readonly monitorRows = computed(() =>
    this.allOrders().filter(
      (r) =>
        r.phase !== Order72hPhase.Delivered &&
        r.hoursUntilDelivery <= 72 &&
        r.hoursUntilDelivery > 24,
    ),
  );

  readonly overdueRows = computed(() =>
    this.allOrders().filter(
      (r) =>
        r.phase === Order72hPhase.ConfirmationOverdue ||
        r.confirmationStatus === RestaurantConfirmationStatus.Overdue,
    ),
  );

  loadMonitor(): void {
    this.page.set({ viewState: 'loading' });
    const rows = this.monitorRows();
    this.page.set({ viewState: rows.length ? 'success' : 'empty' });
  }

  loadOverdue(): void {
    this.page.set({ viewState: 'loading' });
    const rows = this.overdueRows();
    this.page.set({ viewState: rows.length ? 'success' : 'empty' });
  }

  loadReplacementWindows(): void {
    this.page.set({ viewState: 'loading' });
    const rows = this.replacementWindows();
    this.page.set({ viewState: rows.length ? 'success' : 'empty' });
  }

  loadPreparation24h(): void {
    this.page.set({ viewState: 'loading' });
    const rows = this.preparationRows();
    this.page.set({ viewState: rows.length ? 'success' : 'empty' });
  }

  retry(): void {
    const state = this.page().viewState;
    if (state === 'error' || state === 'empty') {
      this.loadMonitor();
    }
  }

  openReplacementWindow(orderId: string, _reason: string): void {
    this.allOrders.update((rows) =>
      rows.map((r) =>
        r.orderId === orderId
          ? {
              ...r,
              phase: Order72hPhase.ReplacementWindowOpen,
              replacementWindowStatus: ReplacementWindowStatus.Open,
            }
          : r,
      ),
    );

    const row = this.allOrders().find((r) => r.orderId === orderId);
    if (!row) {
      return;
    }

    const now = new Date();
    const closes = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    this.replacementWindows.update((windows) => [
      {
        orderId,
        customerDisplayName: row.customerDisplayName,
        originalRestaurantName: row.restaurantName,
        windowOpensAt: now.toISOString(),
        windowClosesAt: closes.toISOString(),
        status: ReplacementWindowStatus.Open,
        hoursRemaining: 24,
      },
      ...windows.filter((w) => w.orderId !== orderId),
    ]);
  }

  manualReassign(orderId: string, targetRestaurantId: string, targetRestaurantName: string): void {
    this.allOrders.update((rows) =>
      rows.map((r) =>
        r.orderId === orderId
          ? {
              ...r,
              restaurantId: targetRestaurantId,
              restaurantName: targetRestaurantName,
              confirmationStatus: RestaurantConfirmationStatus.Reassigned,
              phase: Order72hPhase.AwaitingRestaurantConfirmation,
            }
          : r,
      ),
    );
  }

  reset(): void {
    this.page.set({ viewState: 'idle' });
    this.allOrders.set([...ORDER_72H_MOCK_ROWS]);
    this.replacementWindows.set([...REPLACEMENT_WINDOW_MOCK]);
    this.preparationRows.set([...PREPARATION_24H_MOCK]);
    this.exceptionLogs.set([...ORDER_EXCEPTION_LOGS_MOCK]);
  }
}

/** @deprecated Use Order72hStore */
export { Order72hStore as Order72hStateService };
