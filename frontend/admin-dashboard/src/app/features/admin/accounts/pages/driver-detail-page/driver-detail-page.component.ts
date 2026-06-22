import { Component, inject, computed, signal, OnInit, DestroyRef, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { provideIcons } from '@ng-icons/core';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { DRIVERS_ACCOUNTS_I18N } from '../../../../../core/i18n/translations/drivers-accounts.i18n';
import { AdminPageContextService } from '../../../../../core/navigation/admin-page-context.service';
import {
  ACCOUNTS_DETAIL_ICONS,
  DetailTabItem,
  MmDetailTabNavComponent,
  MmDetailToastComponent,
} from '../../../../../shared/components/accounts';
import { AccountsStateService } from '../../data/accounts-state.service';
import { DriverAccount } from '../../models/accounts.model';
import { DriverAnalyticsPanelComponent } from '../../components/driver/driver-analytics-panel.component';
import { DriverDeliveriesPanelComponent } from '../../components/driver/driver-deliveries-panel.component';
import { DriverDetailsPanelComponent } from '../../components/driver/driver-details-panel.component';
import { DriverOverviewPanelComponent } from '../../components/driver/driver-overview-panel.component';
import { DriverSettingsPanelComponent } from '../../components/driver/driver-settings-panel.component';

type DriverDetailTab = 'overview' | 'details' | 'analytics' | 'deliveries' | 'settings';

@Component({
  selector: 'mm-driver-detail-page',
  standalone: true,
  imports: [
    MmDetailTabNavComponent,
    MmDetailToastComponent,
    DriverOverviewPanelComponent,
    DriverDetailsPanelComponent,
    DriverAnalyticsPanelComponent,
    DriverDeliveriesPanelComponent,
    DriverSettingsPanelComponent,
  ],
  templateUrl: './driver-detail-page.component.html',
  providers: [provideIcons(ACCOUNTS_DETAIL_ICONS)],
})
export class DriverDetailPageComponent implements OnInit {
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly locale = inject(AppLocaleService);
  readonly stateService = inject(AccountsStateService);
  private readonly pageContext = inject(AdminPageContextService);
  private readonly destroyRef = inject(DestroyRef);

  readonly copy = computed(() => DRIVERS_ACCOUNTS_I18N[this.locale.locale()]);

  readonly driverId = signal<string | null>(null);
  readonly activeTab = signal<DriverDetailTab>('overview');

  readonly driver = computed<DriverAccount | null>(() => {
    const id = this.driverId();
    if (!id) return null;
    return this.stateService.drivers().find((d) => d.id === id) || null;
  });

  readonly tabs = computed<DetailTabItem[]>(() => {
    const rtl = this.locale.isRtl();
    return [
      { id: 'overview', icon: 'lucideLayoutDashboard', label: rtl ? 'نظرة عامة' : 'Overview' },
      { id: 'details', icon: 'lucideUser', label: rtl ? 'البيانات والمستندات' : 'Driver Details' },
      { id: 'analytics', icon: 'lucideTrendingUp', label: rtl ? 'التحليلات والأداء' : 'Performance & Analytics' },
      { id: 'deliveries', icon: 'lucideTruck', label: rtl ? 'متابعة التوصيل والمسار' : 'Deliveries & Routes' },
      { id: 'settings', icon: 'lucideSettings', label: rtl ? 'الإعدادات والتشغيل' : 'Operational Settings' },
    ];
  });

  readonly toastMessage = signal<string | null>(null);
  readonly toastType = signal<'success' | 'warning' | 'info'>('success');

  constructor() {
    effect(() => {
      const item = this.driver();
      if (!item) return;

      const title = item.fullName;
      const desc = `${this.copy().driverId} ${item.id}`;

      this.pageContext.customTitle.set(title);
      this.pageContext.customDescription.set(desc);
      this.pageContext.customBreadcrumbs.set([
        { label: this.locale.isRtl() ? 'الحسابات' : 'Accounts' },
        { label: this.locale.isRtl() ? 'اعتماد الحسابات' : 'Account Approvals' },
        { label: this.locale.isRtl() ? 'السائقون' : 'Drivers', route: '/admin/accounts/drivers' },
        { label: item.fullName, active: true },
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
      this.driverId.set(id);
    } else {
      this.router.navigate(['/admin/accounts/drivers']);
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab.set(tab as DriverDetailTab);
  }

  toggleSuspension(): void {
    const drv = this.driver();
    if (!drv) return;

    if (drv.status === 'Suspended') {
      this.stateService.unsuspendDriver(drv.id);
      this.showToast(
        this.locale.isRtl() ? 'تم إلغاء إيقاف السائق بنجاح' : 'Driver unsuspended successfully',
        'success',
      );
    } else {
      this.stateService.suspendDriver(drv.id);
      this.showToast(
        this.locale.isRtl() ? 'تم إيقاف السائق مؤقتاً' : 'Driver suspended temporarily',
        'warning',
      );
    }
  }

  triggerExpiryWarning(): void {
    this.showToast(
      this.locale.isRtl()
        ? 'تم إرسال تنبيه للسائق لتجديد المستندات المنتهية'
        : 'Alert sent to driver to renew expired documents',
      'info',
    );
  }

  private showToast(message: string, type: 'success' | 'warning' | 'info'): void {
    this.toastMessage.set(message);
    this.toastType.set(type);
    setTimeout(() => this.toastMessage.set(null), 3000);
  }
}
