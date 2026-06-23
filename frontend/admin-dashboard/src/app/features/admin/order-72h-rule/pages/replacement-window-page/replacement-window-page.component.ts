import { Component, computed, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch, lucideRefreshCw, lucideClock } from '@ng-icons/lucide';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { ORDERS_72H_I18N } from '../../../../../core/i18n/translations/orders-72h.i18n';
import { Order72hStore } from '../../data/order-72h-store';
import { ReplacementWindowStatus } from '../../models';

@Component({
  selector: 'mm-replacement-window-page',
  standalone: true,
  imports: [NgClass, NgIcon],
  providers: [provideIcons({ lucideSearch, lucideRefreshCw, lucideClock })],
  templateUrl: './replacement-window-page.component.html',
  host: { class: 'block' },
})
export class ReplacementWindowPageComponent {
  readonly locale = inject(AppLocaleService);
  readonly store = inject(Order72hStore);

  readonly copy = computed(() => ORDERS_72H_I18N[this.locale.locale()]);
  readonly searchQuery = signal('');
  readonly statusFilter = signal<string>('all');

  readonly kpis = computed(() => {
    const rows = this.store.replacementWindows();
    return {
      open: rows.filter((r) => r.status === ReplacementWindowStatus.Open).length,
      expired: rows.filter((r) => r.status === ReplacementWindowStatus.Expired).length,
      completed: rows.filter((r) => r.status === ReplacementWindowStatus.Completed).length,
      total: rows.length,
    };
  });

  readonly filteredRows = computed(() => {
    let rows = this.store.replacementWindows();
    const q = this.searchQuery().toLowerCase().trim();
    const status = this.statusFilter();

    if (q) {
      rows = rows.filter(
        (r) =>
          r.orderId.toLowerCase().includes(q) ||
          r.customerDisplayName.toLowerCase().includes(q) ||
          r.originalRestaurantName.toLowerCase().includes(q),
      );
    }

    if (status !== 'all') {
      rows = rows.filter((r) => r.status === status);
    }

    return rows;
  });

  statusLabel(status: ReplacementWindowStatus): string {
    const c = this.copy();
    switch (status) {
      case ReplacementWindowStatus.Open:
        return c.windowOpen;
      case ReplacementWindowStatus.Expired:
        return c.windowExpired;
      case ReplacementWindowStatus.Completed:
        return c.windowCompleted;
      default:
        return status;
    }
  }

  statusClass(status: ReplacementWindowStatus): string {
    switch (status) {
      case ReplacementWindowStatus.Open:
        return 'bg-violet-50 text-violet-700 ring-violet-200';
      case ReplacementWindowStatus.Expired:
        return 'bg-red-50 text-red-700 ring-red-200';
      case ReplacementWindowStatus.Completed:
        return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 ring-slate-200';
    }
  }
}
