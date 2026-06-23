import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
import { AccountsStateService } from '../../data/accounts-state.service';
import { RestaurantAccount } from '../../models/accounts.model';

@Component({
  selector: 'mm-restaurant-wallet-panel',
  standalone: true,
  imports: [NgClass, NgIconComponent, FormsModule],
  templateUrl: './restaurant-wallet-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons(ACCOUNTS_DETAIL_ICONS)],
})
export class RestaurantWalletPanelComponent {
  readonly locale = inject(AppLocaleService);
  readonly state = inject(AccountsStateService);
  readonly restaurant = input.required<RestaurantAccount>();
  readonly commissionSaved = output<void>();

  readonly copy = computed(() => RESTAURANTS_ACCOUNTS_I18N[this.locale.locale()]);

  readonly wallet = computed(() => buildRestaurantWallet(this.restaurant()));
  readonly commissionDraft = signal(12);
  readonly commissionDirty = signal(false);

  readonly ledgerView = signal<'settlements' | 'transactions'>('settlements');

  constructor() {
    effect(() => {
      const pct = this.restaurant().restaurantCommissionPercent ?? 12;
      this.commissionDraft.set(pct);
      this.commissionDirty.set(false);
    });
  }

  protected setLedgerView(view: 'settlements' | 'transactions'): void {
    this.ledgerView.set(view);
  }

  protected onCommissionChange(value: number): void {
    this.commissionDraft.set(value);
    const current = this.restaurant().restaurantCommissionPercent ?? 12;
    this.commissionDirty.set(value !== current);
  }

  protected saveCommission(): void {
    const value = this.commissionDraft();
    if (Number.isNaN(value) || value < 0 || value > 100) return;
    this.state.updateRestaurantSettlementCommission(this.restaurant().id, value);
    this.commissionDirty.set(false);
    this.commissionSaved.emit();
  }

  protected formatCommissionDate(iso?: string): string {
    if (!iso) return '—';
    return new Intl.DateTimeFormat(this.locale.locale() === 'ar' ? 'ar-KW' : 'en-KW', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Kuwait',
    }).format(new Date(iso));
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
