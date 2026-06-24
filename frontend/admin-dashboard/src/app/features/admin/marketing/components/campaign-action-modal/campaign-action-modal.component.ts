import { Component, computed, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { CampaignModalShellComponent } from '../campaign-modal-shell/campaign-modal-shell.component';
import { MARKETING_I18N } from '../../i18n/marketing.i18n';

export type CampaignActionType = 'send' | 'review' | 'stop' | 'redistribute' | 'increaseCap';

@Component({
  selector: 'mm-campaign-action-modal',
  standalone: true,
  imports: [FormsModule, CampaignModalShellComponent],
  templateUrl: './campaign-action-modal.component.html',
})
export class CampaignActionModalComponent {
  readonly open = input(false);
  readonly action = input<CampaignActionType>('send');
  readonly confirmed = output<{ reason: string; value?: number }>();
  readonly closed = output<void>();

  readonly locale = inject(AppLocaleService);
  readonly copy = computed(() => MARKETING_I18N[this.locale.locale()]);
  readonly reason = signal('');
  readonly newCap = signal(800);

  readonly title = computed(() => {
    const c = this.copy();
    const map: Record<CampaignActionType, string> = {
      send: c.sendCampaign,
      review: c.markReviewed,
      stop: c.stopCampaign,
      redistribute: c.redistributeCapacity,
      increaseCap: c.modalIncreaseCapTitle,
    };
    return map[this.action()];
  });

  readonly description = computed(() => {
    const c = this.copy();
    const map: Record<CampaignActionType, string> = {
      send: c.modalSendDesc,
      review: c.modalReviewDesc,
      stop: c.modalStopDesc,
      redistribute: c.modalRedistributeDesc,
      increaseCap: c.modalIncreaseCapDesc,
    };
    return map[this.action()];
  });

  readonly confirmLabel = computed(() => {
    const c = this.copy();
    if (this.action() === 'stop') return c.stopCampaign;
    if (this.action() === 'increaseCap') return c.modalConfirmIncrease;
    return c.save;
  });

  readonly danger = computed(() => this.action() === 'stop');

  close(): void {
    this.reason.set('');
    this.closed.emit();
  }

  confirm(): void {
    const payload: { reason: string; value?: number } = { reason: this.reason() };
    if (this.action() === 'increaseCap') payload.value = this.newCap();
    this.confirmed.emit(payload);
    this.close();
  }
}
