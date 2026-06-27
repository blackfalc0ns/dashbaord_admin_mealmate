import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { MmDetailPanelCardComponent } from '@/shared/components/accounts';
import { MmTablePaginationComponent } from '@/shared/components/layout/table-pagination';
import { createTablePagination } from '@/shared/utils/table-pagination.util';
import { MARKETING_I18N } from '../../i18n/marketing.i18n';
import { CampaignParticipant, CollaborativeCampaign } from '../../models';

@Component({
  selector: 'mm-campaign-review-panel',
  standalone: true,
  imports: [MmDetailPanelCardComponent, MmTablePaginationComponent],
  templateUrl: './campaign-review-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignReviewPanelComponent {
  readonly campaign = input.required<CollaborativeCampaign>();

  readonly locale = inject(AppLocaleService);
  readonly copy = computed(() => MARKETING_I18N[this.locale.locale()]);
  readonly pg = createTablePagination(5);
  readonly currentPage = this.pg.currentPage;
  readonly pageSize = this.pg.pageSize;

  readonly agreedParticipants = computed(() =>
    this.campaign().participants.filter((p) => p.enrollmentStatus === 'Agreed'),
  );

  readonly paginatedAgreedParticipants = this.pg.paginated(this.agreedParticipants);
  readonly totalPages = this.pg.totalPages(this.agreedParticipants);
  readonly paginationItems = computed(() => (this.locale.isRtl() ? 'مشارك' : 'participants'));

  onPageChange(page: number): void {
    this.pg.onPageChange(page, this.totalPages());
  }

  restaurantName(p: CampaignParticipant): string {
    return this.locale.isRtl() ? p.restaurantNameAr : p.restaurantNameEn;
  }
}
