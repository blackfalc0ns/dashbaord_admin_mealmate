import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideExternalLink, lucideMail, lucidePhone, lucideUser } from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { MmDetailPanelCardComponent } from '@/shared/components/accounts';
import { MARKETING_I18N } from '../../i18n/marketing.i18n';
import { InfluencerProfile } from '../../models';

@Component({
  selector: 'mm-influencer-profile-panel',
  standalone: true,
  imports: [DatePipe, NgIconComponent, MmDetailPanelCardComponent],
  providers: [provideIcons({ lucideUser, lucidePhone, lucideMail, lucideExternalLink })],
  templateUrl: './influencer-profile-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfluencerProfilePanelComponent {
  readonly influencer = input.required<InfluencerProfile>();

  readonly locale = inject(AppLocaleService);
  readonly copy = computed(() => MARKETING_I18N[this.locale.locale()]);
}
