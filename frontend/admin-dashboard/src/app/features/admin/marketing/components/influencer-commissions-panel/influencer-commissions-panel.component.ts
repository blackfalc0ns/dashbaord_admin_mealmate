import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DatePipe, DecimalPipe, NgClass } from '@angular/common';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { MmDetailPanelCardComponent } from '@/shared/components/accounts';
import { MARKETING_I18N } from '../../i18n/marketing.i18n';
import { InfluencerCommission, InfluencerProfile } from '../../models';

@Component({
  selector: 'mm-influencer-commissions-panel',
  standalone: true,
  imports: [DatePipe, DecimalPipe, NgClass, MmDetailPanelCardComponent],
  templateUrl: './influencer-commissions-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfluencerCommissionsPanelComponent {
  readonly influencer = input.required<InfluencerProfile>();

  readonly locale = inject(AppLocaleService);
  readonly copy = computed(() => MARKETING_I18N[this.locale.locale()]);

  readonly sortedCommissions = computed(() =>
    [...this.influencer().commissions].sort(
      (a, b) => new Date(b.createdAtUtc).getTime() - new Date(a.createdAtUtc).getTime(),
    ),
  );

  statusLabel(status: InfluencerCommission['status']): string {
    const c = this.copy();
    if (status === 'Pending') return c.commissionStatusPending;
    if (status === 'Paid') return c.commissionStatusPaid;
    return c.commissionStatusReversed;
  }

  statusClass(status: InfluencerCommission['status']): string {
    if (status === 'Pending') return 'bg-amber-50 text-amber-800 ring-amber-200';
    if (status === 'Paid') return 'bg-emerald-50 text-emerald-800 ring-emerald-200';
    return 'bg-red-50 text-red-800 ring-red-200';
  }
}
