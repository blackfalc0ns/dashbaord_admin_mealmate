import { Component, computed, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTriangle, lucideCheck, lucideRocket } from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { CampaignModalShellComponent } from '../campaign-modal-shell/campaign-modal-shell.component';
import { MARKETING_I18N } from '../../i18n/marketing.i18n';
import { CollaborativeCampaign } from '../../models';
import {
  canLaunch,
  totalCampaignCapacity,
} from '../../utils/collaborative-campaign.util';

@Component({
  selector: 'mm-campaign-launch-modal',
  standalone: true,
  imports: [FormsModule, NgIcon, CampaignModalShellComponent],
  providers: [provideIcons({ lucideRocket, lucideCheck, lucideTriangle })],
  templateUrl: './campaign-launch-modal.component.html',
})
export class CampaignLaunchModalComponent {
  readonly open = input(false);
  readonly campaign = input.required<CollaborativeCampaign>();
  readonly confirmed = output<{ reason: string }>();
  readonly closed = output<void>();

  readonly locale = inject(AppLocaleService);
  readonly copy = computed(() => MARKETING_I18N[this.locale.locale()]);
  readonly reason = signal('');

  readonly capacity = computed(() => totalCampaignCapacity(this.campaign()));
  readonly ready = computed(() => canLaunch(this.campaign()));
  readonly agreedCount = computed(() =>
    this.campaign().participants.filter((p) => p.enrollmentStatus === 'Agreed').length,
  );

  close(): void {
    this.reason.set('');
    this.closed.emit();
  }

  confirm(): void {
    if (!this.ready()) return;
    this.confirmed.emit({ reason: this.reason() });
    this.close();
  }
}
