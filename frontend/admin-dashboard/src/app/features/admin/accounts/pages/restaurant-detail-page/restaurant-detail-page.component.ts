import { Component, inject, computed, signal, OnInit, DestroyRef, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { provideIcons } from '@ng-icons/core';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { RESTAURANTS_ACCOUNTS_I18N } from '../../../../../core/i18n/translations/restaurants-accounts.i18n';
import { AdminPageContextService } from '../../../../../core/navigation/admin-page-context.service';
import {
  ACCOUNTS_DETAIL_ICONS,
  DetailTabItem,
  MmDetailTabNavComponent,
  MmDetailToastComponent,
} from '../../../../../shared/components/accounts';
import { AccountsStateService } from '../../data/accounts-state.service';
import { RestaurantAccount } from '../../models/accounts.model';
import { RestaurantAnalyticsPanelComponent } from '../../components/restaurant/restaurant-analytics-panel.component';
import { RestaurantDetailsPanelComponent } from '../../components/restaurant/restaurant-details-panel.component';
import { RestaurantMealsPanelComponent } from '../../components/restaurant/restaurant-meals-panel.component';
import { RestaurantOverviewPanelComponent } from '../../components/restaurant/restaurant-overview-panel.component';
import { RestaurantSettingsPanelComponent } from '../../components/restaurant/restaurant-settings-panel.component';
import { RestaurantWalletPanelComponent } from '../../components/restaurant/restaurant-wallet-panel.component';

type RestaurantDetailTab = 'overview' | 'details' | 'analytics' | 'wallet' | 'meals' | 'settings';

@Component({
  selector: 'mm-restaurant-detail-page',
  standalone: true,
  imports: [
    MmDetailTabNavComponent,
    MmDetailToastComponent,
    RestaurantOverviewPanelComponent,
    RestaurantDetailsPanelComponent,
    RestaurantAnalyticsPanelComponent,
    RestaurantMealsPanelComponent,
    RestaurantSettingsPanelComponent,
    RestaurantWalletPanelComponent,
  ],
  templateUrl: './restaurant-detail-page.component.html',
  providers: [provideIcons(ACCOUNTS_DETAIL_ICONS)],
})
export class RestaurantDetailPageComponent implements OnInit {
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly locale = inject(AppLocaleService);
  readonly stateService = inject(AccountsStateService);
  private readonly pageContext = inject(AdminPageContextService);
  private readonly destroyRef = inject(DestroyRef);

  readonly copy = computed(() => RESTAURANTS_ACCOUNTS_I18N[this.locale.locale()]);

  readonly restaurantId = signal<string | null>(null);
  readonly activeTab = signal<RestaurantDetailTab>('overview');

  readonly restaurant = computed<RestaurantAccount | null>(() => {
    const id = this.restaurantId();
    if (!id) return null;
    return this.stateService.restaurants().find((r) => r.id === id) || null;
  });

  readonly tabs = computed<DetailTabItem[]>(() => {
    const rtl = this.locale.isRtl();
    return [
      { id: 'overview', icon: 'lucideLayoutDashboard', label: rtl ? 'نظرة عامة' : 'Overview' },
      { id: 'details', icon: 'lucideBuilding', label: rtl ? 'البيانات والمستندات' : 'Company Details' },
      { id: 'analytics', icon: 'lucideTrendingUp', label: rtl ? 'التحليلات والأداء' : 'Analytics & Performance' },
      { id: 'wallet', icon: 'lucideWallet', label: rtl ? 'المحفظة والمالية' : 'Wallet & Finance' },
      { id: 'meals', icon: 'lucideUtensils', label: rtl ? 'متابعة الوجبات والملصقات' : 'Meals & Labels' },
      { id: 'settings', icon: 'lucideSettings', label: rtl ? 'الإعدادات والتشغيل' : 'Operational Settings' },
    ];
  });

  readonly toastMessage = signal<string | null>(null);
  readonly toastType = signal<'success' | 'warning' | 'info'>('success');

  constructor() {
    effect(() => {
      const item = this.restaurant();
      if (!item) return;

      const title = this.t(item.nameAr, item.nameEn);
      const desc = `${this.copy().restaurantId} ${item.id}`;

      this.pageContext.customTitle.set(title);
      this.pageContext.customDescription.set(desc);
      this.pageContext.customBreadcrumbs.set([
        { label: this.locale.isRtl() ? 'الحسابات' : 'Accounts' },
        { label: this.locale.isRtl() ? 'اعتماد الحسابات' : 'Account Approvals' },
        { label: this.locale.isRtl() ? 'المطاعم' : 'Restaurants', route: '/admin/accounts/restaurants' },
        { label: this.t(item.nameAr, item.nameEn), active: true },
      ]);
    });

    this.destroyRef.onDestroy(() => {
      this.pageContext.customTitle.set(null);
      this.pageContext.customDescription.set(null);
      this.pageContext.customBreadcrumbs.set(null);
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.restaurantId.set(id);
    } else {
      this.router.navigate(['/admin/accounts/restaurants']);
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab.set(tab as RestaurantDetailTab);
  }

  t(ar: string, en: string): string {
    return this.locale.isRtl() ? ar : en;
  }

  toggleSuspension(): void {
    const res = this.restaurant();
    if (!res) return;

    if (res.status === 'Suspended') {
      this.stateService.unsuspendRestaurant(res.id);
      this.showToast(
        this.locale.isRtl() ? 'تم إلغاء إيقاف الحساب بنجاح' : 'Account unsuspended successfully',
        'success',
      );
    } else {
      this.stateService.suspendRestaurant(res.id);
      this.showToast(
        this.locale.isRtl() ? 'تم إيقاف الحساب مؤقتاً' : 'Account suspended temporarily',
        'warning',
      );
    }
  }

  triggerManualAudit(): void {
    this.showToast(
      this.locale.isRtl() ? 'تم بدء فحص يدوي شامل للمستندات والمنيو' : 'Comprehensive manual audit initiated',
      'info',
    );
  }

  private showToast(message: string, type: 'success' | 'warning' | 'info'): void {
    this.toastMessage.set(message);
    this.toastType.set(type);
    setTimeout(() => this.toastMessage.set(null), 3000);
  }
}
