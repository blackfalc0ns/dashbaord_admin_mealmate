import { Component, Input, inject, computed } from '@angular/core';
import { AdminOrderDetail } from '../../../models';
import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { OPERATIONS_I18N } from '@/core/i18n/translations/operations.i18n';

@Component({
  selector: 'mm-order-prep-panel',
  standalone: true,
  template: `
    <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <dl class="grid gap-3 sm:grid-cols-2">
        <div><dt class="text-xs font-bold text-slate-500">{{ copy().barcode }}</dt><dd [class.text-emerald-600]="order.barcodeGenerated" [class.text-red-600]="!order.barcodeGenerated">{{ order.barcodeGenerated ? copy().yes : copy().no }}</dd></div>
        <div><dt class="text-xs font-bold text-slate-500">{{ copy().invoice }}</dt><dd [class.text-emerald-600]="order.invoiceGenerated" [class.text-red-600]="!order.invoiceGenerated">{{ order.invoiceGenerated ? copy().yes : copy().no }}</dd></div>
        <div><dt class="text-xs font-bold text-slate-500">{{ copy().driver }}</dt><dd>{{ order.driverName ?? copy().unassigned }}</dd></div>
      </dl>
    </div>
  `,
})
export class OrderPrepPanelComponent {
  readonly locale = inject(AppLocaleService);
  readonly copy = computed(() => OPERATIONS_I18N[this.locale.locale()]);
  @Input({ required: true }) order!: AdminOrderDetail;
}
