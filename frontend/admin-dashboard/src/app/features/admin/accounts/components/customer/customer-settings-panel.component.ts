import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { NgClass } from '@angular/common';
import { provideIcons, NgIconComponent } from '@ng-icons/core';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { CUSTOMERS_ACCOUNTS_I18N } from '../../../../../core/i18n/translations/customers-accounts.i18n';
import { ACCOUNTS_DETAIL_ICONS } from '../../../../../shared/components/accounts/accounts-detail-icons';
import { t as translate } from '../../../../../shared/components/accounts/accounts-detail.utils';
import { CustomerAccount } from '../../models/accounts.model';

@Component({
  selector: 'mm-customer-settings-panel',
  standalone: true,
  imports: [NgClass, NgIconComponent],
  templateUrl: './customer-settings-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons(ACCOUNTS_DETAIL_ICONS)],
})
export class CustomerSettingsPanelComponent {
  readonly locale = inject(AppLocaleService);
  readonly customer = input.required<CustomerAccount>();
  readonly copy = computed(() => CUSTOMERS_ACCOUNTS_I18N[this.locale.locale()]);

  readonly toggleSuspension = output<void>();
  readonly toggleFreeze = output<void>();

  protected t(ar: string, en: string): string {
    return translate(this.locale, ar, en);
  }

  protected onToggleSuspension(): void {
    this.toggleSuspension.emit();
  }

  protected onToggleFreeze(): void {
    this.toggleFreeze.emit();
  }

  protected canFreeze(item: CustomerAccount): boolean {
    return !!item.subscriptionId && (item.status === 'Active' || item.status === 'Frozen');
  }
}
