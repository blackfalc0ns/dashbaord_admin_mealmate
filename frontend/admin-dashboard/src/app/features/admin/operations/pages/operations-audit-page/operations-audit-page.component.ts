import { Component, inject, computed, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { OPERATIONS_I18N } from '@/core/i18n/translations/operations.i18n';
import { OperationsStateService } from '../../data/operations-state.service';
import { OrderExceptionType } from '../../models';

@Component({
  selector: 'mm-operations-audit-page',
  standalone: true,
  imports: [NgIcon],
  providers: [provideIcons({ lucideSearch })],
  templateUrl: './operations-audit-page.component.html',
  host: { class: 'block' },
})
export class OperationsAuditPageComponent {
  readonly locale = inject(AppLocaleService);
  readonly state = inject(OperationsStateService);
  readonly copy = computed(() => OPERATIONS_I18N[this.locale.locale()]);
  readonly searchQuery = signal('');

  readonly logs = computed(() => {
    let list = this.state.exceptionLogs();
    const q = this.searchQuery().toLowerCase().trim();
    if (q) {
      list = list.filter(
        (l) =>
          l.orderId.toLowerCase().includes(q) ||
          l.customerDisplayName.toLowerCase().includes(q) ||
          l.reason.toLowerCase().includes(q),
      );
    }
    return list;
  });

  exceptionLabel(type: OrderExceptionType): string {
    switch (type) {
      case OrderExceptionType.ChangeBox:
        return this.copy().changeBox;
      case OrderExceptionType.ChangeRestaurant:
        return this.copy().changeRestaurant;
      case OrderExceptionType.CancelDay:
        return this.copy().cancelDay;
      default:
        return type;
    }
  }
}
