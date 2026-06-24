import { Component, computed, inject, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight, lucideStore } from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { CampaignModalShellComponent } from '../campaign-modal-shell/campaign-modal-shell.component';
import { MARKETING_I18N } from '../../i18n/marketing.i18n';
import { CampaignParticipant, CollaborativeCampaign } from '../../models';

@Component({
  selector: 'mm-campaign-participant-modal',
  standalone: true,
  imports: [NgIcon, CampaignModalShellComponent],
  providers: [provideIcons({ lucideStore, lucideArrowRight })],
  templateUrl: './campaign-participant-modal.component.html',
})
export class CampaignParticipantModalComponent {
  readonly open = input(false);
  readonly campaign = input.required<CollaborativeCampaign>();
  readonly participant = input<CampaignParticipant | null>(null);
  readonly closed = output<void>();

  readonly locale = inject(AppLocaleService);
  readonly copy = computed(() => MARKETING_I18N[this.locale.locale()]);

  close(): void {
    this.closed.emit();
  }

  restaurantName(p: CampaignParticipant): string {
    return this.locale.isRtl() ? p.restaurantNameAr : p.restaurantNameEn;
  }

  bundleName(p: CampaignParticipant): string {
    return this.locale.isRtl() ? p.bundleLabelAr : p.bundleLabelEn;
  }

  statusLabel(status: CampaignParticipant['enrollmentStatus']): string {
    const c = this.copy();
    if (status === 'Agreed') return c.enrollmentAgreed;
    if (status === 'Declined') return c.enrollmentDeclined;
    return c.enrollmentPending;
  }
}
