import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { provideIcons, NgIconComponent } from '@ng-icons/core';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { RESTAURANTS_ACCOUNTS_I18N } from '../../../../../core/i18n/translations/restaurants-accounts.i18n';
import { ACCOUNTS_DETAIL_ICONS } from '../../../../../shared/components/accounts/accounts-detail-icons';
import { docStatusLabel, t as translate } from '../../../../../shared/components/accounts/accounts-detail.utils';
import { AccountsStateService } from '../../data/accounts-state.service';
import { RestaurantAccount } from '../../models/accounts.model';

@Component({
  selector: 'mm-restaurant-details-panel',
  standalone: true,
  imports: [NgClass, NgIconComponent, RouterLink],
  templateUrl: './restaurant-details-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons(ACCOUNTS_DETAIL_ICONS)],
})
export class RestaurantDetailsPanelComponent {
  readonly locale = inject(AppLocaleService);
  private readonly stateService = inject(AccountsStateService);

  readonly restaurant = input.required<RestaurantAccount>();
  readonly copy = computed(() => RESTAURANTS_ACCOUNTS_I18N[this.locale.locale()]);

  readonly selectedDocId = signal<string | null>(null);

  readonly selectedDoc = computed(() => {
    const item = this.restaurant();
    const docId = this.selectedDocId();
    if (!item.documents.length) return null;
    if (!docId) return item.documents[0];
    return item.documents.find((d) => d.id === docId) ?? item.documents[0];
  });

  readonly affiliatedDrivers = computed(() => {
    const res = this.restaurant();
    return this.stateService.drivers().filter((d) => d.restaurantId === res.id);
  });

  constructor() {
    effect(() => {
      const item = this.restaurant();
      if (item.documents.length && !this.selectedDocId()) {
        this.selectedDocId.set(item.documents[0].id);
      }
    });
  }

  protected t(ar: string, en: string): string {
    return translate(this.locale, ar, en);
  }

  protected docStatusLabel(status: string): string {
    return docStatusLabel(this.locale, status as Parameters<typeof docStatusLabel>[1]);
  }
}
