import { Component, Input, inject, computed } from '@angular/core';
import { AdminOrderDetail } from '../../../models';
import { OrderLifecyclePhase } from '../../../models/order-lifecycle.enums';
import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { OPERATIONS_I18N } from '@/core/i18n/translations/operations.i18n';
import { MmDetailFieldComponent, MmDetailPanelCardComponent } from '@/shared/components/accounts';
import { MmOrderLifecycleBadgeComponent, MmSlaCountdownComponent } from '@/shared/components/operations';

@Component({
  selector: 'mm-order-overview-panel',
  standalone: true,
  imports: [
    MmDetailFieldComponent,
    MmDetailPanelCardComponent,
    MmOrderLifecycleBadgeComponent,
    MmSlaCountdownComponent,
  ],
  templateUrl: './order-overview-panel.component.html',
})
export class OrderOverviewPanelComponent {
  readonly locale = inject(AppLocaleService);
  readonly copy = computed(() => OPERATIONS_I18N[this.locale.locale()]);
  readonly OrderLifecyclePhase = OrderLifecyclePhase;

  @Input({ required: true }) order!: AdminOrderDetail;

  subscriptionDayLabel(): string {
    const c = this.copy();
    return c.dayOfTotal
      .replace('{day}', String(this.order.extras.subscriptionDayIndex))
      .replace('{total}', String(this.order.extras.subscriptionDayTotal));
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
