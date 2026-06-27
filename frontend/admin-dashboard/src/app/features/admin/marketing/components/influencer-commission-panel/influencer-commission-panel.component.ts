import { ChangeDetectionStrategy, Component, computed, inject, input, model, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { AdminPermissions } from '@/core/auth/admin-permissions';
import { HasPermissionDirective } from '@/shared/directives/has-permission.directive';
import { MmDetailPanelCardComponent } from '@/shared/components/accounts';
import { MmTablePaginationComponent } from '@/shared/components/layout/table-pagination';
import { createTablePagination } from '@/shared/utils/table-pagination.util';
import { MARKETING_I18N } from '../../i18n/marketing.i18n';
import { InfluencerProfile } from '../../models';

@Component({
  selector: 'mm-influencer-commission-panel',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    MmDetailPanelCardComponent,
    HasPermissionDirective,
    MmTablePaginationComponent,
  ],
  templateUrl: './influencer-commission-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfluencerCommissionPanelComponent {
  readonly influencer = input.required<InfluencerProfile>();
  readonly commissionRate = model.required<number>();
  readonly saveRate = output<void>();

  readonly locale = inject(AppLocaleService);
  readonly perms = AdminPermissions;
  readonly copy = computed(() => MARKETING_I18N[this.locale.locale()]);
  readonly pg = createTablePagination(5);
  readonly currentPage = this.pg.currentPage;
  readonly pageSize = this.pg.pageSize;

  readonly commissionRateHistory = computed(() => this.influencer().commissionRateHistory);

  readonly paginatedHistory = this.pg.paginated(this.commissionRateHistory);
  readonly totalPages = this.pg.totalPages(this.commissionRateHistory);
  readonly paginationItems = computed(() => (this.locale.isRtl() ? 'سجل' : 'records'));

  onPageChange(page: number): void {
    this.pg.onPageChange(page, this.totalPages());
  }
}
