import { Component, Input, inject, computed } from '@angular/core';
import { AdminPermissions } from '@/core/auth/admin-permissions';
import { OrderStatusBadgeComponent } from '../../../../../shared/components/order-status-badge/order-status-badge.component';
import { HasPermissionDirective } from '../../../../../shared/directives/has-permission.directive';
import { AdminOrder72hRow } from '../../models';
import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { ORDERS_72H_I18N } from '../../../../../core/i18n/translations/orders-72h.i18n';

@Component({
  selector: 'mm-order-72h-table',
  standalone: true,
  imports: [OrderStatusBadgeComponent, HasPermissionDirective],
  templateUrl: './order-72h-table.component.html',
})
export class Order72hTableComponent {
  readonly locale = inject(AppLocaleService);
  readonly copy = computed(() => ORDERS_72H_I18N[this.locale.locale()]);
  readonly perms = AdminPermissions;

  @Input({ required: true }) rows: AdminOrder72hRow[] = [];
  @Input() mode: 'monitor' | 'overdue' = 'monitor';
  @Input() onOpenReplacement?: (orderId: string) => void;
  @Input() onManualReassign?: (orderId: string) => void;
}
