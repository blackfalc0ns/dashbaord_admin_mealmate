import { Component, Input, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminOrderDetail } from '../../../models';
import { DeliveryTrackingRow, HoldCaseRow } from '../../../models/delivery.model';
import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { DELIVERY_STATUS_LABELS, OPERATIONS_I18N } from '@/core/i18n/translations/operations.i18n';

@Component({
  selector: 'mm-order-delivery-panel',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (tracking) {
      <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <dl class="grid gap-3 sm:grid-cols-2">
          <div><dt class="text-xs font-bold text-slate-500">{{ copy().status }}</dt><dd>{{ statusLabel(tracking.status) }}</dd></div>
          <div><dt class="text-xs font-bold text-slate-500">{{ copy().driver }}</dt><dd>{{ tracking.driverName }}</dd></div>
          <div><dt class="text-xs font-bold text-slate-500">{{ copy().area }}</dt><dd>{{ tracking.areaName }}</dd></div>
          <div><dt class="text-xs font-bold text-slate-500">{{ copy().eta }}</dt><dd>{{ tracking.etaMinutes ?? copy().none }}{{ tracking.etaMinutes ? copy().minutes : '' }}</dd></div>
        </dl>
      </div>
    } @else {
      <p class="text-sm text-slate-500">{{ copy().noTracking }}</p>
    }
    @if (hold) {
      <div class="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p class="text-xs font-bold text-amber-800">{{ copy().holdTab }}</p>
        <p class="mt-1 text-sm text-amber-900">{{ hold.holdReason }}</p>
        <a routerLink="/admin/operations/delivery" [queryParams]="{ tab: 'hold' }" class="mt-2 inline-block text-xs font-bold text-amber-700 underline">{{ copy().holdTab }}</a>
      </div>
    }
  `,
})
export class OrderDeliveryPanelComponent {
  readonly locale = inject(AppLocaleService);
  readonly copy = computed(() => OPERATIONS_I18N[this.locale.locale()]);
  @Input({ required: true }) order!: AdminOrderDetail;
  @Input() tracking: DeliveryTrackingRow | null = null;
  @Input() hold: HoldCaseRow | null = null;

  statusLabel(status: string): string {
    return DELIVERY_STATUS_LABELS[this.locale.locale()][status] ?? status;
  }
}
