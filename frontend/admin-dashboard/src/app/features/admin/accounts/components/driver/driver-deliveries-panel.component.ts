import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { provideIcons, NgIconComponent } from '@ng-icons/core';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { DRIVERS_ACCOUNTS_I18N } from '../../../../../core/i18n/translations/drivers-accounts.i18n';
import { ACCOUNTS_DETAIL_ICONS } from '../../../../../shared/components/accounts/accounts-detail-icons';
import { t as translate } from '../../../../../shared/components/accounts/accounts-detail.utils';
import { DriverAccount } from '../../models/accounts.model';

@Component({
  selector: 'mm-driver-deliveries-panel',
  standalone: true,
  imports: [NgClass, NgIconComponent],
  templateUrl: './driver-deliveries-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons(ACCOUNTS_DETAIL_ICONS)],
})
export class DriverDeliveriesPanelComponent {
  readonly locale = inject(AppLocaleService);
  readonly driver = input.required<DriverAccount>();
  readonly copy = computed(() => DRIVERS_ACCOUNTS_I18N[this.locale.locale()]);

  readonly activeDeliveries = signal([
    { id: 'DEL-8821', restaurant: 'مطبخ دايت كير', restaurantEn: 'Diet Care Kitchen', customer: 'أحمد العتيبي', customerEn: 'Ahmed Al-Otaibi', addressAr: 'حولي، ق4، ش تونس', addressEn: 'Hawally, B4, Tunis St', status: 'picked_up', barcode: 'MM-DEL-8821', proximity: '1.2 km' },
    { id: 'DEL-8822', restaurant: 'هيلثي ستوب', restaurantEn: 'Healthy Stop', customer: 'سارة المطيري', customerEn: 'Sara Al-Mutairi', addressAr: 'السالمية، ق2، ش بغداد', addressEn: 'Salmiya, B2, Baghdad St', status: 'assigned', barcode: 'MM-DEL-8822', proximity: '4.5 km' },
    { id: 'DEL-8823', restaurant: 'بروتين بار', restaurantEn: 'Protein Bar', customer: 'فهد الديحاني', customerEn: 'Fahad Al-Dihani', addressAr: 'الروضة، ق1، ش دمشق', addressEn: 'Rawda, B1, Damascus St', status: 'delivered', barcode: 'MM-DEL-8823', proximity: '0 km' },
  ]);

  protected t(ar: string, en: string): string {
    return translate(this.locale, ar, en);
  }
}
