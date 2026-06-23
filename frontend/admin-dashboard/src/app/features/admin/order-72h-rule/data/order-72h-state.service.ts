import { Injectable, signal } from '@angular/core';
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
  getMonitorRows,
  getOverdueRows,
  ORDER_72H_MOCK_ROWS,
  ORDER_EXCEPTION_LOGS_MOCK,
  PREPARATION_24H_MOCK,
  REPLACEMENT_WINDOW_MOCK,
} from '../data/order-72h.mock';

@Injectable({ providedIn: 'root' })
export class Order72hStateService {
  readonly allOrders = signal<AdminOrder72hRow[]>([...ORDER_72H_MOCK_ROWS]);
  readonly replacementWindows = signal<ReplacementWindowRow[]>([...REPLACEMENT_WINDOW_MOCK]);
  readonly preparationRows = signal<Preparation24hRow[]>([...PREPARATION_24H_MOCK]);
  readonly exceptionLogs = signal<OrderExceptionLog[]>([...ORDER_EXCEPTION_LOGS_MOCK]);

  monitorRows(): AdminOrder72hRow[] {
    return getMonitorRows();
  }

  overdueRows(): AdminOrder72hRow[] {
    return getOverdueRows();
  }

  openReplacementWindow(orderId: string, reason: string): void {
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
}
