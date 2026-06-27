import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { MmDetailPanelCardComponent } from '@/shared/components/accounts';
import { MmTablePaginationComponent } from '@/shared/components/layout/table-pagination';
import { createTablePagination } from '@/shared/utils/table-pagination.util';
import { MARKETING_I18N } from '../../i18n/marketing.i18n';
import { ReferralAttribution, InfluencerProfile } from '../../models';

@Component({
  selector: 'mm-influencer-attributions-panel',
  standalone: true,
  imports: [DatePipe, MmDetailPanelCardComponent, MmTablePaginationComponent],
  templateUrl: './influencer-attributions-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfluencerAttributionsPanelComponent {
  readonly influencer = input.required<InfluencerProfile>();

  readonly locale = inject(AppLocaleService);
  readonly copy = computed(() => MARKETING_I18N[this.locale.locale()]);
  readonly pg = createTablePagination(5);
  readonly currentPage = this.pg.currentPage;
  readonly pageSize = this.pg.pageSize;

  readonly sortedAttributions = computed(() =>
    [...this.influencer().attributions].sort(
      (a, b) => new Date(b.attributedAtUtc).getTime() - new Date(a.attributedAtUtc).getTime(),
    ),
  );

  readonly paginatedAttributions = this.pg.paginated(this.sortedAttributions);
  readonly totalPages = this.pg.totalPages(this.sortedAttributions);
  readonly paginationItems = computed(() => (this.locale.isRtl() ? 'إحالة' : 'referrals'));

  onPageChange(page: number): void {
    this.pg.onPageChange(page, this.totalPages());
  }

  customerName(attr: ReferralAttribution): string {
    return this.locale.isRtl() ? attr.customerNameAr : attr.customerNameEn;
  }
}
