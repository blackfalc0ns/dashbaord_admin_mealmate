import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucideActivity,
  lucideClipboardList,
  lucideLink,
  lucideTicket,
  lucideTrendingUp,
  lucideUser,
  lucideUsers,
  lucideWallet,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { MARKETING_I18N, INFLUENCER_STATUS_LABELS } from '../../i18n/marketing.i18n';
import { InfluencerProfile, InfluencerStatus } from '../../models';
import { influencerStatusClasses } from '../../utils/marketing-status.util';

@Component({
  selector: 'mm-influencer-overview-panel',
  standalone: true,
  imports: [NgClass, DatePipe, DecimalPipe, NgIconComponent],
  providers: [
    provideIcons({
      lucideUsers,
      lucideWallet,
      lucideTrendingUp,
      lucideActivity,
      lucideClipboardList,
      lucideLink,
      lucideTicket,
      lucideUser,
    }),
  ],
  templateUrl: './influencer-overview-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfluencerOverviewPanelComponent {
  readonly influencer = input.required<InfluencerProfile>();
  readonly viewAttributions = output<void>();

  readonly locale = inject(AppLocaleService);
  readonly copy = computed(() => MARKETING_I18N[this.locale.locale()]);

  readonly trend = computed(() => this.influencer().performanceTrend ?? []);
  readonly channelStats = computed(() => this.influencer().channelStats);
  readonly maxReferrals = computed(() => {
    const values = this.trend().map((p) => p.referrals);
    return Math.max(...values, 1);
  });

  readonly recentAttributions = computed(() =>
    [...this.influencer().attributions]
      .sort((a, b) => new Date(b.attributedAtUtc).getTime() - new Date(a.attributedAtUtc).getTime())
      .slice(0, 5),
  );

  statusLabel(status: InfluencerStatus): string {
    const labels = INFLUENCER_STATUS_LABELS[status];
    return this.locale.isRtl() ? labels.ar : labels.en;
  }

  statusClass(status: InfluencerStatus): string {
    return influencerStatusClasses(status);
  }

  trendLabel(point: { labelAr: string; labelEn: string }): string {
    return this.locale.isRtl() ? point.labelAr : point.labelEn;
  }

  customerName(attr: { customerNameAr: string; customerNameEn: string }): string {
    return this.locale.isRtl() ? attr.customerNameAr : attr.customerNameEn;
  }


  barHeight(value: number): string {
    return `${Math.round((value / this.maxReferrals()) * 100)}%`;
  }
}
