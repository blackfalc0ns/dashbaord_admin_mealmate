import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { MmTablePaginationComponent } from '@/shared/components/layout/table-pagination';
import { createTablePagination } from '@/shared/utils/table-pagination.util';
import { MARKETING_I18N } from '../../i18n/marketing.i18n';
import { MarketingStore } from '../../data/marketing-store';

@Component({
  selector: 'mm-marketing-reports-page',
  standalone: true,
  imports: [DatePipe, FormsModule, MmTablePaginationComponent],
  templateUrl: './marketing-reports-page.component.html',
  host: { class: 'block' },
})
export class MarketingReportsPageComponent implements OnInit {
  readonly locale = inject(AppLocaleService);
  readonly store = inject(MarketingStore);
  readonly copy = computed(() => MARKETING_I18N[this.locale.locale()]);
  readonly periodDays = signal(30);
  readonly influencerFilter = signal('all');
  readonly pg = createTablePagination(5);
  readonly currentPage = this.pg.currentPage;
  readonly pageSize = this.pg.pageSize;

  readonly kpis = this.store.overviewKpis;
  readonly influencers = this.store.influencers;

  readonly channelBreakdown = computed(() => {
    const influencers = this.store.influencers();
    let link = 0;
    let code = 0;
    for (const inf of influencers) {
      for (const a of inf.attributions) {
        if (a.sourceType === 'link') link++;
        else code++;
      }
    }
    return { link, code };
  });

  readonly commissionRows = computed(() => {
    const filter = this.influencerFilter();
    return this.store
      .influencers()
      .filter((i) => filter === 'all' || i.id === filter)
      .flatMap((i) =>
        i.commissions.map((c) => ({
          influencerName: this.locale.isRtl() ? i.displayNameAr : i.displayNameEn,
          ...c,
        })),
      );
  });

  readonly paginatedCommissionRows = this.pg.paginated(this.commissionRows);
  readonly totalPages = this.pg.totalPages(this.commissionRows);
  readonly paginationItems = computed(() => (this.locale.isRtl() ? 'عمولة' : 'commissions'));

  ngOnInit(): void {
    this.store.load();
  }

  onInfluencerFilter(value: string): void {
    this.influencerFilter.set(value);
    this.pg.resetPage();
  }

  onPageChange(page: number): void {
    this.pg.onPageChange(page, this.totalPages());
  }
}
