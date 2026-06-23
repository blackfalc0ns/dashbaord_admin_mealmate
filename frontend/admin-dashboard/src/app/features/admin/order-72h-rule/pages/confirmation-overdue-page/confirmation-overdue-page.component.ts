import { Component, computed, inject, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch, lucideCircleAlert, lucideRefreshCw, lucideStore } from '@ng-icons/lucide';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { ORDERS_72H_I18N } from '../../../../../core/i18n/translations/orders-72h.i18n';
import { Order72hStore } from '../../data/order-72h-store';
import { Order72hTableComponent } from '../../components/order-72h-table/order-72h-table.component';

@Component({
  selector: 'mm-confirmation-overdue-page',
  standalone: true,
  imports: [NgIcon, Order72hTableComponent],
  providers: [provideIcons({ lucideSearch, lucideCircleAlert, lucideRefreshCw, lucideStore })],
  templateUrl: './confirmation-overdue-page.component.html',
  host: { class: 'block' },
})
export class ConfirmationOverduePageComponent {
  readonly locale = inject(AppLocaleService);
  readonly store = inject(Order72hStore);

  readonly copy = computed(() => ORDERS_72H_I18N[this.locale.locale()]);
  readonly searchQuery = signal('');
  readonly toast = signal<string | null>(null);

  readonly rows = computed(() => {
    let list = this.store.overdueRows();
    const q = this.searchQuery().toLowerCase().trim();
    if (q) {
      list = list.filter(
        (r) =>
          r.orderId.toLowerCase().includes(q) ||
          r.customerDisplayName.toLowerCase().includes(q) ||
          r.restaurantName.toLowerCase().includes(q),
      );
    }
    return list;
  });

  openReplacement = (orderId: string): void => {
    this.store.openReplacementWindow(orderId, 'Restaurant missed 24h confirmation');
    this.toast.set(`${this.copy().openReplacement}: ${orderId}`);
    setTimeout(() => this.toast.set(null), 3000);
  };

  manualReassign = (orderId: string): void => {
    this.store.manualReassign(orderId, 'RST-002', 'Green Kitchen');
    this.toast.set(`${this.copy().manualReassign}: ${orderId}`);
    setTimeout(() => this.toast.set(null), 3000);
  };
}
