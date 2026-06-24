import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideTriangle, lucideUsers } from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { MmDetailPanelCardComponent } from '@/shared/components/accounts';
import { MARKETING_I18N } from '../../i18n/marketing.i18n';
import { CollaborativeCampaign } from '../../models';
import { capacityMeetsTarget, totalCampaignCapacity } from '../../utils/collaborative-campaign.util';

@Component({
  selector: 'mm-campaign-capacity-panel',
  standalone: true,
  imports: [NgIconComponent, MmDetailPanelCardComponent],
  providers: [provideIcons({ lucideUsers, lucideTriangle })],
  templateUrl: './campaign-capacity-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignCapacityPanelComponent {
  readonly campaign = input.required<CollaborativeCampaign>();
  readonly openAction = output<string>();

  readonly locale = inject(AppLocaleService);
  readonly copy = computed(() => MARKETING_I18N[this.locale.locale()]);
  readonly Math = Math;

  totalCapacity(c: CollaborativeCampaign): number {
    return totalCampaignCapacity(c);
  }

  capacityOk(c: CollaborativeCampaign): boolean {
    return capacityMeetsTarget(c);
  }

  capacityPct(c: CollaborativeCampaign): number {
    if (!c.maxSubscribers) return 0;
    return Math.min(100, Math.round((totalCampaignCapacity(c) / c.maxSubscribers) * 100));
  }

  gap(c: CollaborativeCampaign): number {
    return Math.max(0, c.maxSubscribers - totalCampaignCapacity(c));
  }
}
