import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { provideIcons, NgIconComponent } from '@ng-icons/core';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { DRIVERS_ACCOUNTS_I18N } from '../../../../../core/i18n/translations/drivers-accounts.i18n';
import { ACCOUNTS_DETAIL_ICONS } from '../../../../../shared/components/accounts/accounts-detail-icons';
import { t as translate } from '../../../../../shared/components/accounts/accounts-detail.utils';
import { DriverAccount } from '../../models/accounts.model';

@Component({
  selector: 'mm-driver-overview-panel',
  standalone: true,
  imports: [NgClass, NgIconComponent],
  templateUrl: './driver-overview-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons(ACCOUNTS_DETAIL_ICONS)],
})
export class DriverOverviewPanelComponent {
  readonly locale = inject(AppLocaleService);
  readonly driver = input.required<DriverAccount>();
  readonly copy = computed(() => DRIVERS_ACCOUNTS_I18N[this.locale.locale()]);

  readonly recentActivities = signal([
    { id: 1, actionAr: 'توصيل الطلب #DEL-8823 بنجاح ومسح الباركود', actionEn: 'Order #DEL-8823 delivered successfully with barcode scan', timeAr: 'منذ 30 دقيقة', timeEn: '30 mins ago', type: 'success' },
    { id: 2, actionAr: 'استلام وجبات مطبخ دايت كير بنجاح', actionEn: 'Meals picked up from Diet Care Kitchen successfully', timeAr: 'منذ ساعة', timeEn: '1 hour ago', type: 'info' },
    { id: 3, actionAr: 'تحديث رخصة القيادة المعتمدة من المرور', actionEn: 'Approved driving license updated', timeAr: 'منذ يومين', timeEn: '2 days ago', type: 'success' },
    { id: 4, actionAr: 'تنبيه: اقتراب موعد انتهاء دفتر السيارة', actionEn: 'Warning: Vehicle registration expiry approaching', timeAr: 'منذ أسبوع', timeEn: '1 week ago', type: 'warning' },
  ]);

  protected t(ar: string, en: string): string {
    return translate(this.locale, ar, en);
  }
}
