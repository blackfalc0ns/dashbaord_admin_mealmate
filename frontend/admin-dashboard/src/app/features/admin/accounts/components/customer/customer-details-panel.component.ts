import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { provideIcons, NgIconComponent } from '@ng-icons/core';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { CUSTOMERS_ACCOUNTS_I18N } from '../../../../../core/i18n/translations/customers-accounts.i18n';
import { ACCOUNTS_DETAIL_ICONS } from '../../../../../shared/components/accounts/accounts-detail-icons';
import { t as translate } from '../../../../../shared/components/accounts/accounts-detail.utils';
import { CustomerAccount } from '../../models/accounts.model';

@Component({
  selector: 'mm-customer-details-panel',
  standalone: true,
  imports: [NgIconComponent, RouterLink],
  templateUrl: './customer-details-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons(ACCOUNTS_DETAIL_ICONS)],
})
export class CustomerDetailsPanelComponent {
  readonly locale = inject(AppLocaleService);
  readonly customer = input.required<CustomerAccount>();
  readonly copy = computed(() => CUSTOMERS_ACCOUNTS_I18N[this.locale.locale()]);

  protected t(ar: string, en: string): string {
    return translate(this.locale, ar, en);
  }

  protected name(item: CustomerAccount): string {
    return this.t(item.nameAr, item.nameEn);
  }
}
