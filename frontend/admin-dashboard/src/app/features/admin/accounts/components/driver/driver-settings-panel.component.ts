import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { NgClass } from '@angular/common';
import { provideIcons, NgIconComponent } from '@ng-icons/core';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { DRIVERS_ACCOUNTS_I18N } from '../../../../../core/i18n/translations/drivers-accounts.i18n';
import { ACCOUNTS_DETAIL_ICONS } from '../../../../../shared/components/accounts/accounts-detail-icons';
import { t as translate } from '../../../../../shared/components/accounts/accounts-detail.utils';
import { DriverAccount } from '../../models/accounts.model';

@Component({
  selector: 'mm-driver-settings-panel',
  standalone: true,
  imports: [NgClass, NgIconComponent],
  templateUrl: './driver-settings-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons(ACCOUNTS_DETAIL_ICONS)],
})
export class DriverSettingsPanelComponent {
  readonly locale = inject(AppLocaleService);
  readonly driver = input.required<DriverAccount>();
  readonly copy = computed(() => DRIVERS_ACCOUNTS_I18N[this.locale.locale()]);

  readonly expiryWarning = output<void>();
  readonly toggleSuspension = output<void>();

  protected t(ar: string, en: string): string {
    return translate(this.locale, ar, en);
  }

  protected onExpiryWarning(): void {
    this.expiryWarning.emit();
  }

  protected onToggleSuspension(): void {
    this.toggleSuspension.emit();
  }
}
