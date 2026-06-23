import { Component, Input, computed, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { OrderLifecyclePhase } from '../../../features/admin/operations/models';
import { AppLocaleService } from '../../../core/i18n/app-locale.service';
import { ORDER_PHASE_LABELS } from '../../../core/i18n/translations/operations.i18n';

/** @deprecated Use mm-order-lifecycle-badge from shared/components/operations */
@Component({
  selector: 'mm-order-status-badge',
  standalone: true,
  imports: [NgClass],
  templateUrl: './order-status-badge.component.html',
})
export class OrderStatusBadgeComponent {
  private readonly locale = inject(AppLocaleService);

  @Input({ required: true }) phase!: OrderLifecyclePhase;

  readonly label = computed(
    () => ORDER_PHASE_LABELS[this.locale.locale()][this.phase] ?? this.phase,
  );

  readonly toneClass = computed(() => {
    switch (this.phase) {
      case OrderLifecyclePhase.Editable:
        return 'bg-slate-100 text-slate-700 ring-slate-200';
      case OrderLifecyclePhase.LockedAt72h:
      case OrderLifecyclePhase.AwaitingRestaurantConfirmation:
        return 'bg-amber-50 text-amber-700 ring-amber-200';
      case OrderLifecyclePhase.ConfirmationOverdue:
        return 'bg-red-50 text-red-700 ring-red-200';
      case OrderLifecyclePhase.ReplacementWindowOpen:
        return 'bg-violet-50 text-violet-700 ring-violet-200';
      case OrderLifecyclePhase.PreparingAt24h:
        return 'bg-sky-50 text-sky-700 ring-sky-200';
      case OrderLifecyclePhase.Delivered:
        return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 ring-slate-200';
    }
  });
}
