import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { provideIcons, NgIconComponent } from '@ng-icons/core';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { CUSTOMERS_ACCOUNTS_I18N } from '../../../../../core/i18n/translations/customers-accounts.i18n';
import { ACCOUNTS_DETAIL_ICONS } from '../../../../../shared/components/accounts/accounts-detail-icons';
import { t as translate } from '../../../../../shared/components/accounts/accounts-detail.utils';
import { CustomerAccount } from '../../models/accounts.model';

@Component({
  selector: 'mm-customer-subscription-panel',
  standalone: true,
  imports: [NgClass, NgIconComponent, RouterLink],
  templateUrl: './customer-subscription-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons(ACCOUNTS_DETAIL_ICONS)],
})
export class CustomerSubscriptionPanelComponent {
  readonly locale = inject(AppLocaleService);
  readonly customer = input.required<CustomerAccount>();
  readonly copy = computed(() => CUSTOMERS_ACCOUNTS_I18N[this.locale.locale()]);

  readonly Math = Math;

  protected t(ar: string, en: string): string {
    return translate(this.locale, ar, en);
  }

  protected remainingDays(item: CustomerAccount): number {
    if (!item.subscriptionDays || item.usedDays === undefined) return 0;
    return Math.max(item.subscriptionDays - item.usedDays, 0);
  }

  protected isFamily(item: CustomerAccount): boolean {
    return item.subscriptionType === 'Family';
  }

  protected memberName(ar: string, en: string): string {
    return this.t(ar, en);
  }
}
