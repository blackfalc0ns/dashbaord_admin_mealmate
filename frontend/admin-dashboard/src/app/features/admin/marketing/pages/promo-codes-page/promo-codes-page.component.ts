import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { MmTablePaginationComponent } from '@/shared/components/layout/table-pagination';
import { createTablePagination } from '@/shared/utils/table-pagination.util';
import { MARKETING_I18N } from '../../i18n/marketing.i18n';
import { MarketingStore } from '../../data/marketing-store';
import { promoStatusClasses } from '../../utils/marketing-status.util';

@Component({
  selector: 'mm-promo-codes-page',
  standalone: true,
  imports: [NgClass, DatePipe, MmTablePaginationComponent],
  templateUrl: './promo-codes-page.component.html',
  host: { class: 'block' },
})
export class PromoCodesPageComponent implements OnInit {
  readonly locale = inject(AppLocaleService);
  readonly store = inject(MarketingStore);
  readonly copy = computed(() => MARKETING_I18N[this.locale.locale()]);
  readonly sourceFilter = signal<string>('all');
  readonly pg = createTablePagination(5);
  readonly currentPage = this.pg.currentPage;
  readonly pageSize = this.pg.pageSize;

  readonly filtered = computed(() => {
    const src = this.sourceFilter();
    const list = this.store.promoCodes();
    if (src === 'all') return list;
    return list.filter((p) => p.source === src);
  });

  readonly paginatedCodes = this.pg.paginated(this.filtered);
  readonly totalPages = this.pg.totalPages(this.filtered);
  readonly paginationItems = computed(() => (this.locale.isRtl() ? 'رمز' : 'codes'));

  ngOnInit(): void {
    this.store.load();
  }

  onSourceFilter(source: string): void {
    this.sourceFilter.set(source);
    this.pg.resetPage();
  }

  onPageChange(page: number): void {
    this.pg.onPageChange(page, this.totalPages());
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
