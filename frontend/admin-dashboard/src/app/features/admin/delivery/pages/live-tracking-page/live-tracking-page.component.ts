import { Component, computed, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideSearch,
  lucideRadar,
  lucideMapPin,
  lucideTruck,
} from '@ng-icons/lucide';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import {
  DELIVERY_I18N,
  DELIVERY_STATUS_LABELS,
} from '../../../../../core/i18n/translations/delivery.i18n';
import { DeliveryStore } from '../../data/delivery-store';
import { DeliveryStatus } from '../../models/delivery.model';

@Component({
  selector: 'mm-live-tracking-page',
  standalone: true,
  imports: [NgClass, NgIcon],
  providers: [
    provideIcons({
      lucideSearch,
      lucideRadar,
      lucideMapPin,
      lucideTruck,
    }),
  ],
  templateUrl: './live-tracking-page.component.html',
  host: { class: 'block' },
})
export class LiveTrackingPageComponent {
  readonly locale = inject(AppLocaleService);
  readonly store = inject(DeliveryStore);

  readonly copy = computed(() => DELIVERY_I18N[this.locale.locale()]);
  readonly searchQuery = signal('');
  readonly statusFilter = signal<string>('all');

  readonly kpis = computed(() => {
    const rows = this.store.trackingRows();
    return {
      active: rows.filter((r) =>
        ['picked_up', 'in_transit', 'arriving'].includes(r.status),
      ).length,
      arriving: rows.filter((r) => r.status === 'arriving').length,
      delivered: rows.filter((r) => r.status === 'delivered').length,
      awaiting: rows.filter((r) => r.status === 'awaiting_pickup').length,
    };
  });

  readonly filteredRows = computed(() => {
    let rows = this.store.trackingRows();
    const q = this.searchQuery().toLowerCase().trim();
    const status = this.statusFilter();

    if (q) {
      rows = rows.filter(
        (r) =>
          r.orderId.toLowerCase().includes(q) ||
          r.customerDisplayName.toLowerCase().includes(q) ||
          r.driverName.toLowerCase().includes(q) ||
          r.restaurantName.toLowerCase().includes(q),
      );
    }

    if (status !== 'all') {
      rows = rows.filter((r) => r.status === status);
    }

    return rows;
  });

  statusLabel(status: DeliveryStatus): string {
    return DELIVERY_STATUS_LABELS[this.locale.locale()][status] ?? status;
  }

  statusClass(status: DeliveryStatus): string {
    switch (status) {
      case 'awaiting_pickup':
        return 'bg-amber-50 text-amber-700 ring-amber-200';
      case 'picked_up':
      case 'in_transit':
        return 'bg-sky-50 text-sky-700 ring-sky-200';
      case 'arriving':
        return 'bg-violet-50 text-violet-700 ring-violet-200';
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 ring-slate-200';
    }
  }
}
