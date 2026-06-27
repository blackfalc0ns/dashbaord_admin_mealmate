import { Component, computed, inject } from '@angular/core';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { ORDERS_72H_I18N } from '../../../../../core/i18n/translations/orders-72h.i18n';
import { MmTablePaginationComponent } from '@/shared/components/layout/table-pagination';
import { createTablePagination } from '@/shared/utils/table-pagination.util';
import { Order72hStore } from '../../data/order-72h-store';
import { ExceptionFormComponent } from '../../components/exception-form/exception-form.component';
import { OrderExceptionType } from '../../models';

@Component({
  selector: 'mm-order-exception-page',
  standalone: true,
  imports: [ExceptionFormComponent, MmTablePaginationComponent],
  templateUrl: './order-exception-page.component.html',
  host: { class: 'block' },
})
export class OrderExceptionPageComponent {
  readonly locale = inject(AppLocaleService);
  readonly store = inject(Order72hStore);

  readonly copy = computed(() => ORDERS_72H_I18N[this.locale.locale()]);
  readonly pg = createTablePagination(5);
  readonly currentPage = this.pg.currentPage;
  readonly pageSize = this.pg.pageSize;

  readonly logs = computed(() => this.store.exceptionLogs());
  readonly paginatedLogs = this.pg.paginated(this.logs);
  readonly totalPages = this.pg.totalPages(this.logs);
  readonly paginationItems = computed(() => (this.locale.isRtl() ? 'استثناء' : 'exceptions'));

  onPageChange(page: number): void {
    this.pg.onPageChange(page, this.totalPages());
  }

  exceptionLabel(type: OrderExceptionType): string {
    const c = this.copy();
    switch (type) {
      case OrderExceptionType.ChangeBox:
        return c.changeBox;
      case OrderExceptionType.ChangeRestaurant:
        return c.changeRestaurant;
      case OrderExceptionType.CancelDay:
        return c.cancelDay;
      default:
        return type;
    }
  }
}
