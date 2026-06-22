import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { provideIcons, NgIconComponent } from '@ng-icons/core';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { RESTAURANTS_ACCOUNTS_I18N } from '../../../../../core/i18n/translations/restaurants-accounts.i18n';
import { ACCOUNTS_DETAIL_ICONS } from '../../../../../shared/components/accounts/accounts-detail-icons';
import { t as translate } from '../../../../../shared/components/accounts/accounts-detail.utils';
import { RestaurantAccount } from '../../models/accounts.model';

@Component({
  selector: 'mm-restaurant-overview-panel',
  standalone: true,
  imports: [NgClass, NgIconComponent],
  templateUrl: './restaurant-overview-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons(ACCOUNTS_DETAIL_ICONS)],
})
export class RestaurantOverviewPanelComponent {
  readonly locale = inject(AppLocaleService);
  readonly restaurant = input.required<RestaurantAccount>();
  readonly copy = computed(() => RESTAURANTS_ACCOUNTS_I18N[this.locale.locale()]);

  readonly recentActivities = signal([
    { id: 1, actionAr: 'تأكيد الوجبات اليومية لـ 45 مشترك', actionEn: 'Daily meals confirmed for 45 subscribers', timeAr: 'منذ ساعتين', timeEn: '2 hours ago', type: 'success' },
    { id: 2, actionAr: 'تحديث أسعار باقة البلاتينيوم', actionEn: 'Platinum tier prices updated', timeAr: 'أمس', timeEn: 'Yesterday', type: 'info' },
    { id: 3, actionAr: 'اعتماد الشهادة الصحية للعمال من قبل الإدارة', actionEn: 'Workers health certificate approved by Admin', timeAr: 'منذ 3 أيام', timeEn: '3 days ago', type: 'success' },
    { id: 4, actionAr: 'تنبيه: اقتراب موعد انتهاء السجل التجاري', actionEn: 'Warning: Commercial Register expiry approaching', timeAr: 'منذ أسبوع', timeEn: '1 week ago', type: 'warning' },
  ]);

  protected t(ar: string, en: string): string {
    return translate(this.locale, ar, en);
  }
}
