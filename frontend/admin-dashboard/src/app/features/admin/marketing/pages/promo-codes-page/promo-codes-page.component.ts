import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { MARKETING_I18N } from '../../i18n/marketing.i18n';
import { MarketingStore } from '../../data/marketing-store';
import { promoStatusClasses } from '../../utils/marketing-status.util';

@Component({
  selector: 'mm-promo-codes-page',
  standalone: true,
  imports: [NgClass, DatePipe],
  templateUrl: './promo-codes-page.component.html',
  host: { class: 'block' },
})
export class PromoCodesPageComponent implements OnInit {
  readonly locale = inject(AppLocaleService);
  readonly store = inject(MarketingStore);
  readonly copy = computed(() => MARKETING_I18N[this.locale.locale()]);
  readonly sourceFilter = signal<string>('all');

  readonly filtered = computed(() => {
    const src = this.sourceFilter();
    const list = this.store.promoCodes();
    if (src === 'all') return list;
    return list.filter((p) => p.source === src);
  });

  ngOnInit(): void {
    this.store.load();
  }

  statusClass(status: string): string {
    return promoStatusClasses(status);
  }

  sourceLabel(source: string): string {
    const map: Record<string, { ar: string; en: string }> = {
      influencer: { ar: 'مؤثر', en: 'Influencer' },
      campaign: { ar: 'حملة', en: 'Campaign' },
      customer_referral: { ar: 'إحالة عميل', en: 'Customer referral' },
    };
    const l = map[source] ?? { ar: source, en: source };
    return this.locale.isRtl() ? l.ar : l.en;
  }
}
