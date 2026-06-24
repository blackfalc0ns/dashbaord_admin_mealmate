import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { MmDetailPanelCardComponent } from '@/shared/components/accounts';
import { MARKETING_I18N } from '../../i18n/marketing.i18n';
import { ReferralAttribution, InfluencerProfile } from '../../models';

@Component({
  selector: 'mm-influencer-attributions-panel',
  standalone: true,
  imports: [DatePipe, MmDetailPanelCardComponent],
  templateUrl: './influencer-attributions-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfluencerAttributionsPanelComponent {
  readonly influencer = input.required<InfluencerProfile>();

  readonly locale = inject(AppLocaleService);
  readonly copy = computed(() => MARKETING_I18N[this.locale.locale()]);

  readonly sortedAttributions = computed(() =>
    [...this.influencer().attributions].sort(
      (a, b) => new Date(b.attributedAtUtc).getTime() - new Date(a.attributedAtUtc).getTime(),
    ),
  );

  customerName(attr: ReferralAttribution): string {
    return this.locale.isRtl() ? attr.customerNameAr : attr.customerNameEn;
  }
}
