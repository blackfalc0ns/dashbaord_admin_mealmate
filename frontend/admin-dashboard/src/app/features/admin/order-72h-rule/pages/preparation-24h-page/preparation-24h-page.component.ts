import { Component, computed, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideSearch,
  lucidePackage,
  lucideBarcode,
  lucideFileText,
  lucideTruck,
} from '@ng-icons/lucide';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { ORDERS_72H_I18N } from '../../../../../core/i18n/translations/orders-72h.i18n';
import { Order72hStateService } from '../../data/order-72h-state.service';

@Component({
  selector: 'mm-preparation-24h-page',
  standalone: true,
  imports: [NgClass, NgIcon],
  providers: [
    provideIcons({
      lucideSearch,
      lucidePackage,
      lucideBarcode,
      lucideFileText,
      lucideTruck,
    }),
  ],
  templateUrl: './preparation-24h-page.component.html',
  host: { class: 'block' },
})
export class Preparation24hPageComponent {
  readonly locale = inject(AppLocaleService);
  readonly state = inject(Order72hStateService);

  readonly copy = computed(() => ORDERS_72H_I18N[this.locale.locale()]);
  readonly searchQuery = signal('');

  readonly kpis = computed(() => {
    const rows = this.state.preparationRows();
    const ready = rows.filter(
      (r) => r.barcodeGenerated && r.invoiceGenerated && r.driverAssigned,
    ).length;
    const noBarcode = rows.filter((r) => !r.barcodeGenerated).length;
    const noDriver = rows.filter((r) => !r.driverAssigned).length;
    return { total: rows.length, ready, noBarcode, noDriver };
  });

  readonly filteredRows = computed(() => {
    let rows = this.state.preparationRows();
    const q = this.searchQuery().toLowerCase().trim();
    if (q) {
      rows = rows.filter(
        (r) =>
          r.orderId.toLowerCase().includes(q) ||
          r.customerDisplayName.toLowerCase().includes(q) ||
          r.restaurantName.toLowerCase().includes(q) ||
          r.mealName.toLowerCase().includes(q),
      );
    }
    return rows;
  });
}
