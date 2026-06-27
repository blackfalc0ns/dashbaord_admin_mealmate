import { Component, computed, effect, inject, input } from '@angular/core';
import { AdminPermissions } from '@/core/auth/admin-permissions';
import { OrderStatusBadgeComponent } from '../../../../../shared/components/order-status-badge/order-status-badge.component';
import { HasPermissionDirective } from '../../../../../shared/directives/has-permission.directive';
import { MmTablePaginationComponent } from '@/shared/components/layout/table-pagination';
import { createTablePagination } from '@/shared/utils/table-pagination.util';
import { AdminOrder72hRow } from '../../models';
import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { ORDERS_72H_I18N } from '../../../../../core/i18n/translations/orders-72h.i18n';

@Component({
  selector: 'mm-order-72h-table',
  standalone: true,
  imports: [OrderStatusBadgeComponent, HasPermissionDirective, MmTablePaginationComponent],
  templateUrl: './order-72h-table.component.html',
})
export class Order72hTableComponent {
  readonly locale = inject(AppLocaleService);
  readonly copy = computed(() => ORDERS_72H_I18N[this.locale.locale()]);
  readonly perms = AdminPermissions;

  readonly rows = input.required<AdminOrder72hRow[]>();
  readonly itemLabel = input.required<string>();
  readonly mode = input<'monitor' | 'overdue'>('monitor');
  readonly onOpenReplacement = input<(orderId: string) => void>();
  readonly onManualReassign = input<(orderId: string) => void>();

  readonly pg = createTablePagination(5);
  readonly currentPage = this.pg.currentPage;
  readonly pageSize = this.pg.pageSize;

  readonly rowsSignal = computed(() => this.rows());
  readonly paginatedRows = this.pg.paginated(this.rowsSignal);
  readonly totalPages = this.pg.totalPages(this.rowsSignal);

  constructor() {
    effect(() => {
      this.rows();
      this.pg.resetPage();
    }, { allowSignalWrites: true });
  }

  onPageChange(page: number): void {
    this.pg.onPageChange(page, this.totalPages());
  }
}
