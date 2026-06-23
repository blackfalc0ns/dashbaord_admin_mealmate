import { Component, computed, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideSearch,
  lucideClock,
  lucideCircleAlert,
  lucideLock,
  lucideLayoutDashboard,
} from '@ng-icons/lucide';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { ORDERS_72H_I18N } from '../../../../../core/i18n/translations/orders-72h.i18n';
import { Order72hStateService } from '../../data/order-72h-state.service';
import { Order72hTableComponent } from '../../components/order-72h-table/order-72h-table.component';
import { Order72hPhase } from '../../models';

@Component({
  selector: 'mm-order-72h-monitor-page',
  standalone: true,
  imports: [NgClass, NgIcon, Order72hTableComponent],
  providers: [
    provideIcons({
      lucideSearch,
      lucideClock,
      lucideCircleAlert,
      lucideLock,
      lucideLayoutDashboard,
    }),
  ],
  templateUrl: './order-72h-monitor-page.component.html',
  host: { class: 'block' },
})
export class Order72hMonitorPageComponent {
  readonly locale = inject(AppLocaleService);
  readonly state = inject(Order72hStateService);

  readonly copy = computed(() => ORDERS_72H_I18N[this.locale.locale()]);
  readonly searchQuery = signal('');
  readonly phaseFilter = signal<string>('all');

  readonly kpis = computed(() => {
    const rows = this.state.monitorRows();
    return {
      inWindow: rows.length,
      locked: rows.filter((r) => r.isCustomerEditLocked).length,
      awaiting: rows.filter(
        (r) => r.phase === Order72hPhase.AwaitingRestaurantConfirmation,
      ).length,
      overdue: rows.filter(
        (r) => r.phase === Order72hPhase.ConfirmationOverdue,
      ).length,
    };
  });

  readonly filteredRows = computed(() => {
    let rows = this.state.monitorRows();
    const q = this.searchQuery().toLowerCase().trim();
    const phase = this.phaseFilter();

    if (q) {
      rows = rows.filter(
        (r) =>
          r.orderId.toLowerCase().includes(q) ||
          r.customerDisplayName.toLowerCase().includes(q) ||
          r.restaurantName.toLowerCase().includes(q),
      );
    }

    if (phase !== 'all') {
      rows = rows.filter((r) => r.phase === phase);
    }

    return rows;
  });

  setPhaseFilter(value: string): void {
    this.phaseFilter.set(value);
  }
}
