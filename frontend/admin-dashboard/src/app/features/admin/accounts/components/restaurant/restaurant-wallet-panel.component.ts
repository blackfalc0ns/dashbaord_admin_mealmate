import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { provideIcons, NgIconComponent } from '@ng-icons/core';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { RESTAURANTS_ACCOUNTS_I18N } from '../../../../../core/i18n/translations/restaurants-accounts.i18n';
import { ACCOUNTS_DETAIL_ICONS } from '../../../../../shared/components/accounts/accounts-detail-icons';
import { t as translate } from '../../../../../shared/components/accounts/accounts-detail.utils';
import {
  buildRestaurantWallet,
  formatKwd,
  type RestaurantSettlementBatch,
  type RestaurantWalletTransaction,
} from '../../data/accounts-wallet.mock';
import { RestaurantAccount } from '../../models/accounts.model';

@Component({
  selector: 'mm-restaurant-wallet-panel',
  standalone: true,
  imports: [NgClass, NgIconComponent],
  templateUrl: './restaurant-wallet-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons(ACCOUNTS_DETAIL_ICONS)],
})
export class RestaurantWalletPanelComponent {
  readonly locale = inject(AppLocaleService);
  readonly restaurant = input.required<RestaurantAccount>();
  readonly copy = computed(() => RESTAURANTS_ACCOUNTS_I18N[this.locale.locale()]);

  readonly wallet = computed(() => buildRestaurantWallet(this.restaurant()));

  readonly ledgerView = signal<'settlements' | 'transactions'>('settlements');

  protected setLedgerView(view: 'settlements' | 'transactions'): void {
    this.ledgerView.set(view);
  }

  protected t(ar: string, en: string): string {
    return translate(this.locale, ar, en);
  }

  protected fmt(amount: number): string {
    return formatKwd(amount);
  }

  protected settlementStatusLabel(batch: RestaurantSettlementBatch): string {
    const map = {
      paid: { ar: 'تم التحويل', en: 'Paid' },
      pending: { ar: 'معلق', en: 'Pending' },
      processing: { ar: 'قيد المعالجة', en: 'Processing' },
    };
    const entry = map[batch.status];
    return this.t(entry.ar, entry.en);
  }

  protected txStatusLabel(tx: RestaurantWalletTransaction): string {
    const map = {
      posted: { ar: 'مسجّل', en: 'Posted' },
      pending: { ar: 'معلق', en: 'Pending' },
      reversed: { ar: 'معكوس', en: 'Reversed' },
    };
    const entry = map[tx.status];
    return this.t(entry.ar, entry.en);
  }
}
