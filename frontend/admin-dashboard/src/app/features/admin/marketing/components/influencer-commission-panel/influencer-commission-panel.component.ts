import { ChangeDetectionStrategy, Component, computed, inject, input, model, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { AdminPermissions } from '@/core/auth/admin-permissions';
import { HasPermissionDirective } from '@/shared/directives/has-permission.directive';
import { MmDetailPanelCardComponent } from '@/shared/components/accounts';
import { MARKETING_I18N } from '../../i18n/marketing.i18n';
import { InfluencerProfile } from '../../models';

@Component({
  selector: 'mm-influencer-commission-panel',
  standalone: true,
  imports: [DatePipe, FormsModule, MmDetailPanelCardComponent, HasPermissionDirective],
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
}
