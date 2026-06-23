import { Component, Input, inject, computed, output } from '@angular/core';
import { AdminAuthStore } from '@/core/auth/admin-auth.store';
import { AdminPermissions } from '@/core/auth/admin-permissions';
import { OrderExceptionLog, OrderExceptionType } from '../../../models';
import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { OPERATIONS_I18N } from '@/core/i18n/translations/operations.i18n';

@Component({
  selector: 'mm-order-exceptions-panel',
  standalone: true,
  template: `
    <div class="mb-4 flex justify-end">
      @if (canApplyException()) {
        <button type="button" class="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-white" (click)="applyException.emit()">
          {{ copy().applyException }}
        </button>
      }
    </div>
    @if (logs.length === 0) {
      <p class="text-sm text-slate-500">{{ copy().none }}</p>
    } @else {
      <div class="overflow-x-auto rounded-xl border border-slate-200">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 text-xs font-bold uppercase text-slate-500">
            <tr>
              <th class="px-4 py-2 text-start">{{ copy().exceptionType }}</th>
              <th class="px-4 py-2 text-start">{{ copy().reason }}</th>
              <th class="px-4 py-2 text-start">{{ copy().actor }}</th>
              <th class="px-4 py-2 text-start">{{ copy().appliedAt }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            @for (log of logs; track log.id) {
              <tr>
                <td class="px-4 py-2">{{ exceptionLabel(log.exceptionType) }}</td>
                <td class="px-4 py-2 max-w-xs truncate">{{ log.reason }}</td>
                <td class="px-4 py-2 text-xs text-slate-500">{{ log.actorName }}</td>
                <td class="px-4 py-2 text-xs text-slate-500">{{ log.appliedAt }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `,
})
export class OrderExceptionsPanelComponent {
  private readonly auth = inject(AdminAuthStore);
  readonly locale = inject(AppLocaleService);
  readonly copy = computed(() => OPERATIONS_I18N[this.locale.locale()]);
  @Input({ required: true }) logs: OrderExceptionLog[] = [];
  readonly applyException = output<void>();

  canApplyException(): boolean {
    return this.auth.canAccess(AdminPermissions.order72hException);
  }

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
