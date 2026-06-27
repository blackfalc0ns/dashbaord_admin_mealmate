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
import { MmTablePaginationComponent } from '@/shared/components/layout/table-pagination';
import { createTablePagination } from '@/shared/utils/table-pagination.util';
import { Order72hStore } from '../../data/order-72h-store';

@Component({
  selector: 'mm-preparation-24h-page',
  standalone: true,
  imports: [NgClass, NgIcon, MmTablePaginationComponent],
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
  readonly store = inject(Order72hStore);

  readonly copy = computed(() => ORDERS_72H_I18N[this.locale.locale()]);
  readonly searchQuery = signal('');
  readonly pg = createTablePagination(5);
  readonly currentPage = this.pg.currentPage;
  readonly pageSize = this.pg.pageSize;

  readonly kpis = computed(() => {
    const rows = this.store.preparationRows();
    const ready = rows.filter(
      (r) => r.barcodeGenerated && r.invoiceGenerated && r.driverAssigned,
    ).length;
    const noBarcode = rows.filter((r) => !r.barcodeGenerated).length;
    const noDriver = rows.filter((r) => !r.driverAssigned).length;
    return { total: rows.length, ready, noBarcode, noDriver };
  });

  readonly filteredRows = computed(() => {
    let rows = this.store.preparationRows();
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

  readonly paginatedRows = this.pg.paginated(this.filteredRows);
  readonly totalPages = this.pg.totalPages(this.filteredRows);
  readonly paginationItems = computed(() => (this.locale.isRtl() ? 'طلب' : 'orders'));

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
    this.pg.resetPage();
  }

  onPageChange(page: number): void {
    this.pg.onPageChange(page, this.totalPages());
  }
}
