import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { MmDetailPanelCardComponent } from '@/shared/components/accounts';
import { MARKETING_I18N } from '../../i18n/marketing.i18n';
import { InfluencerAuditEvent, InfluencerProfile } from '../../models';

@Component({
  selector: 'mm-influencer-audit-panel',
  standalone: true,
  imports: [DatePipe, MmDetailPanelCardComponent],
  templateUrl: './influencer-audit-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfluencerAuditPanelComponent {
  readonly influencer = input.required<InfluencerProfile>();

  readonly locale = inject(AppLocaleService);
  readonly copy = computed(() => MARKETING_I18N[this.locale.locale()]);

  readonly sortedEvents = computed(() =>
    [...this.influencer().auditLog].sort(
      (a, b) => new Date(b.atUtc).getTime() - new Date(a.atUtc).getTime(),
    ),
  );

  actionLabel(event: InfluencerAuditEvent): string {
    return this.locale.isRtl() ? event.actionAr : event.actionEn;
  }

  detailLabel(event: InfluencerAuditEvent): string | null {
    if (!event.detailAr) return null;
    return this.locale.isRtl() ? event.detailAr : event.detailEn ?? null;
  }
}
