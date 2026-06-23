import { Component, computed, inject } from '@angular/core';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { ORDERS_72H_I18N } from '../../../../../core/i18n/translations/orders-72h.i18n';
import { Order72hStore } from '../../data/order-72h-store';
import { ExceptionFormComponent } from '../../components/exception-form/exception-form.component';
import { OrderExceptionType } from '../../models';

@Component({
  selector: 'mm-order-exception-page',
  standalone: true,
  imports: [ExceptionFormComponent],
  templateUrl: './order-exception-page.component.html',
  host: { class: 'block' },
})
export class OrderExceptionPageComponent {
  readonly locale = inject(AppLocaleService);
  readonly store = inject(Order72hStore);

  readonly copy = computed(() => ORDERS_72H_I18N[this.locale.locale()]);
  readonly logs = computed(() => this.store.exceptionLogs());

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
