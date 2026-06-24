import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideUserRound,
  lucideTrendingUp,
  lucideWallet,
  lucidePercent,
  lucideTicket,
  lucideArrowLeft,
  lucideArrowRight,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { MARKETING_I18N } from '../../i18n/marketing.i18n';
import { MarketingStore } from '../../data/marketing-store';

@Component({
  selector: 'mm-marketing-overview-page',
  standalone: true,
  imports: [RouterLink, NgIcon],
  providers: [
    provideIcons({
      lucideUserRound,
      lucideTrendingUp,
      lucideWallet,
      lucidePercent,
      lucideTicket,
      lucideArrowLeft,
      lucideArrowRight,
    }),
  ],
  templateUrl: './marketing-overview-page.component.html',
  host: { class: 'block' },
})
export class MarketingOverviewPageComponent implements OnInit {
  readonly locale = inject(AppLocaleService);
  readonly store = inject(MarketingStore);

  readonly copy = computed(() => MARKETING_I18N[this.locale.locale()]);
  readonly kpis = this.store.overviewKpis;

  ngOnInit(): void {
    this.store.load();
  }

  t(ar: string, en: string): string {
    return this.locale.isRtl() ? ar : en;
  }
}
