import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { provideIcons, NgIconComponent } from '@ng-icons/core';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { RESTAURANTS_ACCOUNTS_I18N } from '../../../../../core/i18n/translations/restaurants-accounts.i18n';
import { ACCOUNTS_DETAIL_ICONS } from '../../../../../shared/components/accounts/accounts-detail-icons';
import { t as translate } from '../../../../../shared/components/accounts/accounts-detail.utils';
import { RestaurantAccount } from '../../models/accounts.model';

@Component({
  selector: 'mm-restaurant-meals-panel',
  standalone: true,
  imports: [NgClass, NgIconComponent],
  templateUrl: './restaurant-meals-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons(ACCOUNTS_DETAIL_ICONS)],
})
export class RestaurantMealsPanelComponent {
  readonly locale = inject(AppLocaleService);
  readonly restaurant = input.required<RestaurantAccount>();
  readonly copy = computed(() => RESTAURANTS_ACCOUNTS_I18N[this.locale.locale()]);

  readonly activeMeals = signal([
    { id: 'BOX-1029', customer: 'أحمد العتيبي', customerEn: 'Ahmed Al-Otaibi', program: 'كيتو دايت', programEn: 'Keto Diet', type: 'غداء', typeEn: 'Lunch', meal: 'ستيك لحم بصلصة الفطر', mealEn: 'Beef Steak with Mushroom Sauce', status: 'ready', barcode: 'MM-RES1-1029' },
    { id: 'BOX-1030', customer: 'سارة المطيري', customerEn: 'Sara Al-Mutairi', program: 'لايت ورشاقة', programEn: 'Light & Fit', type: 'عشاء', typeEn: 'Dinner', meal: 'سلمون مشوي مع الكينوا', mealEn: 'Grilled Salmon with Quinoa', status: 'dispatched', barcode: 'MM-RES1-1030' },
    { id: 'BOX-1031', customer: 'فهد الديحاني', customerEn: 'Fahad Al-Dihani', program: 'بناء العضلات', programEn: 'Muscle Builder', type: 'غداء', typeEn: 'Lunch', meal: 'صدر دجاج مع أرز بسمتي', mealEn: 'Chicken Breast with Basmati Rice', status: 'preparing', barcode: 'MM-RES1-1031' },
    { id: 'BOX-1032', customer: 'مريم الكندري', customerEn: 'Maryam Al-Kandari', program: 'خالي من الجلوتين', programEn: 'Gluten Free', type: 'فطور', typeEn: 'Breakfast', meal: 'بانكيك الشوفان الصحي', mealEn: 'Oatmeal Healthy Pancakes', status: 'ready', barcode: 'MM-RES1-1032' },
  ]);

  protected t(ar: string, en: string): string {
    return translate(this.locale, ar, en);
  }
}
