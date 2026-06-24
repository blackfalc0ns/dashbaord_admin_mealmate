import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideActivity } from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { MmDetailPanelCardComponent } from '@/shared/components/accounts';
import { MARKETING_I18N } from '../../i18n/marketing.i18n';
import { CollaborativeCampaign } from '../../models';

@Component({
  selector: 'mm-campaign-audit-panel',
  standalone: true,
  imports: [DatePipe, NgIconComponent, MmDetailPanelCardComponent],
  providers: [provideIcons({ lucideActivity })],
  templateUrl: './campaign-audit-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignAuditPanelComponent {
  readonly campaign = input.required<CollaborativeCampaign>();

  readonly locale = inject(AppLocaleService);
  readonly copy = computed(() => MARKETING_I18N[this.locale.locale()]);
}
