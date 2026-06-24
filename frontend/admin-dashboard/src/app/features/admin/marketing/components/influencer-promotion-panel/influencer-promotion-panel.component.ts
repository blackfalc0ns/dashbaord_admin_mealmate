import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideCopy, lucideLink, lucideQrCode, lucideShare2, lucideTicket } from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { MmDetailPanelCardComponent } from '@/shared/components/accounts';
import { MARKETING_I18N } from '../../i18n/marketing.i18n';
import { InfluencerProfile } from '../../models';

@Component({
  selector: 'mm-influencer-promotion-panel',
  standalone: true,
  imports: [DatePipe, NgIconComponent, MmDetailPanelCardComponent],
  providers: [provideIcons({ lucideLink, lucideTicket, lucideCopy, lucideShare2, lucideQrCode })],
  templateUrl: './influencer-promotion-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfluencerPromotionPanelComponent {
  readonly influencer = input.required<InfluencerProfile>();
  readonly copyText = output<string>();

  readonly locale = inject(AppLocaleService);
  readonly copy = computed(() => MARKETING_I18N[this.locale.locale()]);

  usagePercent(code: { usageCount: number; usageLimit?: number | null }): number {
    if (!code.usageLimit) return 0;
    return Math.min(100, Math.round((code.usageCount / code.usageLimit) * 100));
  }
}
