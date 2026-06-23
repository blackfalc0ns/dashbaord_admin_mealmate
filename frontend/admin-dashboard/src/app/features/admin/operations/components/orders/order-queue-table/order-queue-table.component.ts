import { Component, Input, inject, computed, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminOrderRow, OrderLifecyclePhase } from '../../../models';
import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { OPERATIONS_I18N } from '@/core/i18n/translations/operations.i18n';
import {
  MmOrderLifecycleBadgeComponent,
  MmSlaCountdownComponent,
} from '@/shared/components/operations';

export type OrderActionType = 'replacement' | 'reassign' | 'exception';

@Component({
  selector: 'mm-order-queue-table',
  standalone: true,
  imports: [RouterLink, MmOrderLifecycleBadgeComponent, MmSlaCountdownComponent],
  templateUrl: './order-queue-table.component.html',
})
export class OrderQueueTableComponent {
  readonly locale = inject(AppLocaleService);
  readonly copy = computed(() => OPERATIONS_I18N[this.locale.locale()]);

  @Input({ required: true }) rows: AdminOrderRow[] = [];

  readonly actionRequested = output<{ orderId: string; action: OrderActionType }>();

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
