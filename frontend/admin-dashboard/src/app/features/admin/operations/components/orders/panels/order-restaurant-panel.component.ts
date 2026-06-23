import { Component, Input, inject, computed, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';
import { AdminOrderDetail } from '../../../models';
import {
  OrderLifecyclePhase,
  RestaurantConfirmationStatus,
} from '../../../models/order-lifecycle.enums';
import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { AdminPermissions } from '@/core/auth/admin-permissions';
import { OPERATIONS_I18N } from '@/core/i18n/translations/operations.i18n';
import { HasPermissionDirective } from '@/shared/directives/has-permission.directive';
import { MmDetailFieldComponent, MmDetailPanelCardComponent } from '@/shared/components/accounts';

@Component({
  selector: 'mm-order-restaurant-panel',
  standalone: true,
  imports: [RouterLink, NgIconComponent, MmDetailFieldComponent, MmDetailPanelCardComponent, HasPermissionDirective],
  templateUrl: './order-restaurant-panel.component.html',
})
export class OrderRestaurantPanelComponent {
  readonly locale = inject(AppLocaleService);
  readonly copy = computed(() => OPERATIONS_I18N[this.locale.locale()]);
  readonly perms = AdminPermissions;
  readonly OrderLifecyclePhase = OrderLifecyclePhase;
  readonly RestaurantConfirmationStatus = RestaurantConfirmationStatus;

  @Input({ required: true }) order!: AdminOrderDetail;
  readonly action = output<'replacement' | 'reassign'>();

  confirmationStatusLabel(): string {
    const c = this.copy();
    switch (this.order.confirmationStatus) {
      case RestaurantConfirmationStatus.Confirmed:
        return c.confirmStatusConfirmed;
      case RestaurantConfirmationStatus.Overdue:
        return c.confirmStatusOverdue;
      case RestaurantConfirmationStatus.Reassigned:
        return c.confirmStatusReassigned;
      default:
        return c.confirmStatusPending;
    }
  }

  formatDateTime(iso: string | null): string {
    if (!iso) return this.copy().none;
    return new Intl.DateTimeFormat(this.locale.locale() === 'ar' ? 'ar-KW' : 'en-KW', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Kuwait',
    }).format(new Date(iso));
  }
}
