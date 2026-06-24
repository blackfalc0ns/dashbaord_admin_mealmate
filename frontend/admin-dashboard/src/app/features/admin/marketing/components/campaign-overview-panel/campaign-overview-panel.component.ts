import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucideCalendar,
  lucideLayers,
  lucideMegaphone,
  lucidePercent,
  lucideStore,
  lucideTrendingUp,
  lucideUsers,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { MmDetailPanelCardComponent } from '@/shared/components/accounts';
import { MARKETING_I18N, CAMPAIGN_STATUS_LABELS } from '../../i18n/marketing.i18n';
import { CollaborativeCampaign, CollaborativeCampaignStatus } from '../../models';
import { campaignStatusClasses } from '../../utils/marketing-status.util';
import { totalCampaignCapacity } from '../../utils/collaborative-campaign.util';

@Component({
  selector: 'mm-campaign-overview-panel',
  standalone: true,
  imports: [NgClass, DatePipe, NgIconComponent, MmDetailPanelCardComponent],
  providers: [provideIcons({ lucideTrendingUp, lucideMegaphone, lucideLayers, lucideStore, lucideUsers, lucidePercent, lucideCalendar })],
  templateUrl: './campaign-overview-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignOverviewPanelComponent {
  readonly campaign = input.required<CollaborativeCampaign>();
  readonly openAction = output<string>();

  readonly locale = inject(AppLocaleService);
  readonly copy = computed(() => MARKETING_I18N[this.locale.locale()]);
  readonly Math = Math;

  readonly workflowSteps: CollaborativeCampaignStatus[] = [
    'Draft',
    'OpenForJoin',
    'Reviewed',
    'Active',
    'Stopped',
  ];

  statusLabel(status: CollaborativeCampaignStatus): string {
    const labels = CAMPAIGN_STATUS_LABELS[status];
    return this.locale.isRtl() ? labels.ar : labels.en;
  }

  statusClass(status: CollaborativeCampaignStatus): string {
    return campaignStatusClasses(status);
  }

  totalCapacity(c: CollaborativeCampaign): number {
    return totalCampaignCapacity(c);
  }

  subscriberPct(c: CollaborativeCampaign): number {
    return Math.min(100, Math.round((c.currentSubscribers / c.maxSubscribers) * 100));
  }

  capacityPct(c: CollaborativeCampaign): number {
    const cap = totalCampaignCapacity(c);
    return Math.min(100, Math.round((cap / c.maxSubscribers) * 100));
  }
}
