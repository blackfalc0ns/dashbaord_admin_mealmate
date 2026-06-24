import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { provideIcons, NgIconComponent } from '@ng-icons/core';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { CUSTOMERS_ACCOUNTS_I18N } from '../../../../../core/i18n/translations/customers-accounts.i18n';
import { ACCOUNTS_DETAIL_ICONS } from '../../../../../shared/components/accounts/accounts-detail-icons';
import { t as translate } from '../../../../../shared/components/accounts/accounts-detail.utils';
import { CustomerAccount } from '../../models/accounts.model';

@Component({
  selector: 'mm-customer-wallet-panel',
  standalone: true,
  imports: [NgIconComponent],
  templateUrl: './customer-wallet-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons(ACCOUNTS_DETAIL_ICONS)],
})
export class CustomerWalletPanelComponent {
  readonly locale = inject(AppLocaleService);
  readonly customer = input.required<CustomerAccount>();
  readonly copy = computed(() => CUSTOMERS_ACCOUNTS_I18N[this.locale.locale()]);

  readonly transactions = signal([
    { id: 1, descAr: 'استرداد جزئي — إلغاء اشتراك', descEn: 'Partial refund — subscription cancellation', amount: 45.5, type: 'credit' as const, dateAr: '1 مارس 2026', dateEn: '1 Mar 2026' },
    { id: 2, descAr: 'خصم اشتراك شهري', descEn: 'Monthly subscription charge', amount: -120, type: 'debit' as const, dateAr: '1 فبراير 2026', dateEn: '1 Feb 2026' },
    { id: 3, descAr: 'مكافأة ولاء', descEn: 'Loyalty reward credit', amount: 5, type: 'credit' as const, dateAr: '15 يناير 2026', dateEn: '15 Jan 2026' },
  ]);

  protected t(ar: string, en: string): string {
    return translate(this.locale, ar, en);
  }
}
