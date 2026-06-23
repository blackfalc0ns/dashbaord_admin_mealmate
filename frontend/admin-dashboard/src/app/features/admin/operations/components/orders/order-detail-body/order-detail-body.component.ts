import { Component, Input, inject, computed, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';
import {
  AdminOrderDetail,
  DeliveryTrackingRow,
  HoldCaseRow,
  OrderExceptionLog,
  OrderTimelineEvent,
} from '../../../models';
import {
  OrderExceptionType,
  OrderLifecyclePhase,
  RestaurantConfirmationStatus,
} from '../../../models/order-lifecycle.enums';
import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { DELIVERY_STATUS_LABELS, OPERATIONS_I18N } from '@/core/i18n/translations/operations.i18n';
import { MmDetailFieldComponent, MmDetailPanelCardComponent } from '@/shared/components/accounts';
import {
  MmAuditTimelineComponent,
  MmOrderLifecycleBadgeComponent,
  MmSlaCountdownComponent,
} from '@/shared/components/operations';

@Component({
  selector: 'mm-order-detail-body',
  standalone: true,
  imports: [
    RouterLink,
    NgIconComponent,
    MmDetailFieldComponent,
    MmDetailPanelCardComponent,
    MmAuditTimelineComponent,
    MmOrderLifecycleBadgeComponent,
    MmSlaCountdownComponent,
  ],
  templateUrl: './order-detail-body.component.html',
})
export class OrderDetailBodyComponent {
  readonly locale = inject(AppLocaleService);
  readonly copy = computed(() => OPERATIONS_I18N[this.locale.locale()]);
  readonly OrderLifecyclePhase = OrderLifecyclePhase;
  readonly RestaurantConfirmationStatus = RestaurantConfirmationStatus;

  @Input({ required: true }) order!: AdminOrderDetail;
  @Input({ required: true }) events: OrderTimelineEvent[] = [];
  @Input() tracking: DeliveryTrackingRow | null = null;
  @Input() hold: HoldCaseRow | null = null;
  @Input({ required: true }) exceptions: OrderExceptionLog[] = [];

  readonly restaurantAction = output<'replacement' | 'reassign'>();
  readonly applyException = output<void>();

  subscriptionDayLabel(): string {
    const c = this.copy();
    return c.dayOfTotal
      .replace('{day}', String(this.order.extras.subscriptionDayIndex))
      .replace('{total}', String(this.order.extras.subscriptionDayTotal));
  }

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

  deliveryStatusLabel(status: string): string {
    return DELIVERY_STATUS_LABELS[this.locale.locale()][status] ?? status;
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

  showRestaurantActions(): boolean {
    return (
      this.order.phase === OrderLifecyclePhase.ConfirmationOverdue ||
      this.order.phase === OrderLifecyclePhase.ReplacementWindowOpen
    );
  }
}
