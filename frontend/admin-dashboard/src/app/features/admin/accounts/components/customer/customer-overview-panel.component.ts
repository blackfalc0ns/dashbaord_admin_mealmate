import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { provideIcons, NgIconComponent } from '@ng-icons/core';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { CUSTOMERS_ACCOUNTS_I18N } from '../../../../../core/i18n/translations/customers-accounts.i18n';
import { ACCOUNTS_DETAIL_ICONS } from '../../../../../shared/components/accounts/accounts-detail-icons';
import { t as translate } from '../../../../../shared/components/accounts/accounts-detail.utils';
import { CustomerAccount } from '../../models/accounts.model';

@Component({
  selector: 'mm-customer-overview-panel',
  standalone: true,
  imports: [NgClass, NgIconComponent],
  templateUrl: './customer-overview-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons(ACCOUNTS_DETAIL_ICONS)],
})
export class CustomerOverviewPanelComponent {
  readonly locale = inject(AppLocaleService);
  readonly customer = input.required<CustomerAccount>();
  readonly copy = computed(() => CUSTOMERS_ACCOUNTS_I18N[this.locale.locale()]);

  readonly Math = Math;

  readonly recentActivities = signal([
    { id: 1, actionAr: 'اختيار وجبات يوم الخميس قبل قفل -72h', actionEn: 'Selected Thursday meals before 72h lock', timeAr: 'منذ ساعتين', timeEn: '2 hours ago', type: 'success' },
    { id: 2, actionAr: 'تسليم الطلب #ORD-4421 بنجاح', actionEn: 'Order #ORD-4421 delivered successfully', timeAr: 'أمس', timeEn: 'Yesterday', type: 'success' },
    { id: 3, actionAr: 'إضافة 15 نقطة ولاء بعد التقييم', actionEn: '15 loyalty points added after rating', timeAr: 'منذ 3 أيام', timeEn: '3 days ago', type: 'info' },
    { id: 4, actionAr: 'تحديث تفضيلات الحساسية الغذائية', actionEn: 'Updated food allergy preferences', timeAr: 'منذ أسبوع', timeEn: '1 week ago', type: 'info' },
  ]);

  protected t(ar: string, en: string): string {
    return translate(this.locale, ar, en);
  }

  protected name(item: CustomerAccount): string {
    return this.t(item.nameAr, item.nameEn);
  }

  protected remainingDays(item: CustomerAccount): number {
    if (!item.subscriptionDays || item.usedDays === undefined) return 0;
    return Math.max(item.subscriptionDays - item.usedDays, 0);
  }
}
