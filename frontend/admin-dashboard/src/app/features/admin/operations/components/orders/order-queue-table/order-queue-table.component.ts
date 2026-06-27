import { Component, computed, effect, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminPermissions } from '@/core/auth/admin-permissions';
import { AdminOrderRow, OrderLifecyclePhase } from '../../../models';
import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { OPERATIONS_I18N } from '@/core/i18n/translations/operations.i18n';
import { HasPermissionDirective } from '@/shared/directives/has-permission.directive';
import { MmTablePaginationComponent } from '@/shared/components/layout/table-pagination';
import { createTablePagination } from '@/shared/utils/table-pagination.util';
import {
  MmOrderLifecycleBadgeComponent,
  MmSlaCountdownComponent,
} from '@/shared/components/operations';

export type OrderActionType = 'replacement' | 'reassign' | 'exception';

@Component({
  selector: 'mm-order-queue-table',
  standalone: true,
  imports: [
    RouterLink,
    MmOrderLifecycleBadgeComponent,
    MmSlaCountdownComponent,
    HasPermissionDirective,
    MmTablePaginationComponent,
  ],
  templateUrl: './order-queue-table.component.html',
})
export class OrderQueueTableComponent {
  readonly locale = inject(AppLocaleService);
  readonly copy = computed(() => OPERATIONS_I18N[this.locale.locale()]);
  readonly perms = AdminPermissions;

  readonly rows = input.required<AdminOrderRow[]>();
  readonly itemLabel = input.required<string>();

  readonly actionRequested = output<{ orderId: string; action: OrderActionType }>();

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

  canOpenReplacement(row: AdminOrderRow): boolean {
    return row.phase === OrderLifecyclePhase.ConfirmationOverdue;
  }

  canReassign(row: AdminOrderRow): boolean {
    return (
      row.phase === OrderLifecyclePhase.ConfirmationOverdue ||
      row.phase === OrderLifecyclePhase.ReplacementWindowOpen
    );
  }

  requestAction(orderId: string, action: OrderActionType, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.actionRequested.emit({ orderId, action });
  }
}
