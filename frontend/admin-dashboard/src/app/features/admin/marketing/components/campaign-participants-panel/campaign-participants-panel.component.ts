import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideStore } from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { MmDetailPanelCardComponent } from '@/shared/components/accounts';
import { MARKETING_I18N } from '../../i18n/marketing.i18n';
import { CampaignParticipant, CollaborativeCampaign } from '../../models';

@Component({
  selector: 'mm-campaign-participants-panel',
  standalone: true,
  imports: [NgIconComponent, MmDetailPanelCardComponent],
  providers: [provideIcons({ lucideStore, lucideChevronLeft })],
  templateUrl: './campaign-participants-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignParticipantsPanelComponent {
  readonly campaign = input.required<CollaborativeCampaign>();
  readonly selectParticipant = output<CampaignParticipant>();

  readonly locale = inject(AppLocaleService);
  readonly copy = computed(() => MARKETING_I18N[this.locale.locale()]);

  enrollmentLabel(status: CampaignParticipant['enrollmentStatus']): string {
    const c = this.copy();
    if (status === 'Agreed') return c.enrollmentAgreed;
    if (status === 'Declined') return c.enrollmentDeclined;
    return c.enrollmentPending;
  }

  restaurantName(p: CampaignParticipant): string {
    return this.locale.isRtl() ? p.restaurantNameAr : p.restaurantNameEn;
  }
}
