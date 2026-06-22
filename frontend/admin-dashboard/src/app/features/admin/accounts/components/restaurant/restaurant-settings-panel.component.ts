import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { NgClass } from '@angular/common';
import { provideIcons, NgIconComponent } from '@ng-icons/core';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { RESTAURANTS_ACCOUNTS_I18N } from '../../../../../core/i18n/translations/restaurants-accounts.i18n';
import { ACCOUNTS_DETAIL_ICONS } from '../../../../../shared/components/accounts/accounts-detail-icons';
import { RestaurantAccount } from '../../models/accounts.model';

@Component({
  selector: 'mm-restaurant-settings-panel',
  standalone: true,
  imports: [NgClass, NgIconComponent],
  templateUrl: './restaurant-settings-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons(ACCOUNTS_DETAIL_ICONS)],
})
export class RestaurantSettingsPanelComponent {
  readonly locale = inject(AppLocaleService);
  readonly restaurant = input.required<RestaurantAccount>();
  readonly copy = computed(() => RESTAURANTS_ACCOUNTS_I18N[this.locale.locale()]);

  readonly manualAudit = output<void>();
  readonly toggleSuspension = output<void>();

  protected onManualAudit(): void {
    this.manualAudit.emit();
  }

  protected onToggleSuspension(): void {
    this.toggleSuspension.emit();
  }
}
