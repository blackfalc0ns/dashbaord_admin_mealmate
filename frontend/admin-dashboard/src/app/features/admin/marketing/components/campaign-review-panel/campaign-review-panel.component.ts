import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { MmDetailPanelCardComponent } from '@/shared/components/accounts';
import { MARKETING_I18N } from '../../i18n/marketing.i18n';
import { CampaignParticipant, CollaborativeCampaign } from '../../models';

@Component({
  selector: 'mm-campaign-review-panel',
  standalone: true,
  imports: [MmDetailPanelCardComponent],
  templateUrl: './campaign-review-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignReviewPanelComponent {
  readonly campaign = input.required<CollaborativeCampaign>();

  readonly locale = inject(AppLocaleService);
  readonly copy = computed(() => MARKETING_I18N[this.locale.locale()]);

  agreedParticipants(c: CollaborativeCampaign): CampaignParticipant[] {
    return c.participants.filter((p) => p.enrollmentStatus === 'Agreed');
  }

  restaurantName(p: CampaignParticipant): string {
    return this.locale.isRtl() ? p.restaurantNameAr : p.restaurantNameEn;
  }
}
