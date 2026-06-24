import { Component, inject, computed, signal, OnInit, DestroyRef, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { provideIcons } from '@ng-icons/core';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { CUSTOMERS_ACCOUNTS_I18N } from '../../../../../core/i18n/translations/customers-accounts.i18n';
import { AdminPageContextService } from '../../../../../core/navigation/admin-page-context.service';
import {
  ACCOUNTS_DETAIL_ICONS,
  DetailTabItem,
  MmDetailTabNavComponent,
  MmDetailToastComponent,
} from '../../../../../shared/components/accounts';
import { AccountsStateService } from '../../data/accounts-state.service';
import { CustomerAccount } from '../../models/accounts.model';
import { CustomerOverviewPanelComponent } from '../../components/customer/customer-overview-panel.component';
import { CustomerDetailsPanelComponent } from '../../components/customer/customer-details-panel.component';
import { CustomerSubscriptionPanelComponent } from '../../components/customer/customer-subscription-panel.component';
import { CustomerWalletPanelComponent } from '../../components/customer/customer-wallet-panel.component';
import { CustomerSettingsPanelComponent } from '../../components/customer/customer-settings-panel.component';

type CustomerDetailTab = 'overview' | 'details' | 'subscription' | 'wallet' | 'settings';

@Component({
  selector: 'mm-customer-detail-page',
  standalone: true,
  imports: [
    MmDetailTabNavComponent,
    MmDetailToastComponent,
    CustomerOverviewPanelComponent,
    CustomerDetailsPanelComponent,
    CustomerSubscriptionPanelComponent,
    CustomerWalletPanelComponent,
    CustomerSettingsPanelComponent,
  ],
  templateUrl: './customer-detail-page.component.html',
  providers: [provideIcons(ACCOUNTS_DETAIL_ICONS)],
})
export class CustomerDetailPageComponent implements OnInit {
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly locale = inject(AppLocaleService);
  readonly stateService = inject(AccountsStateService);
  private readonly pageContext = inject(AdminPageContextService);
  private readonly destroyRef = inject(DestroyRef);

  readonly copy = computed(() => CUSTOMERS_ACCOUNTS_I18N[this.locale.locale()]);

  readonly customerId = signal<string | null>(null);
  readonly activeTab = signal<CustomerDetailTab>('overview');

  readonly customer = computed<CustomerAccount | null>(() => {
    const id = this.customerId();
    if (!id) return null;
    return this.stateService.customers().find((c) => c.id === id) || null;
  });

  readonly tabs = computed<DetailTabItem[]>(() => {
    const c = this.copy();
    return [
      { id: 'overview', icon: 'lucideLayoutDashboard', label: c.tabOverview },
      { id: 'details', icon: 'lucideUser', label: c.tabDetails },
      { id: 'subscription', icon: 'lucideCalendar', label: c.tabSubscription },
      { id: 'wallet', icon: 'lucideWallet', label: c.tabWallet },
      { id: 'settings', icon: 'lucideSettings', label: c.tabSettings },
    ];
  });

  readonly toastMessage = signal<string | null>(null);
  readonly toastType = signal<'success' | 'warning' | 'info'>('success');

  constructor() {
    effect(() => {
      const item = this.customer();
      if (!item) return;

      const title = this.locale.isRtl() ? item.nameAr : item.nameEn;
      const desc = `${this.copy().customerId} ${item.id}`;

      this.pageContext.customTitle.set(title);
      this.pageContext.customDescription.set(desc);
      this.pageContext.customBreadcrumbs.set([
        { label: this.locale.isRtl() ? 'الحسابات' : 'Accounts' },
        { label: this.locale.isRtl() ? 'اعتماد الحسابات' : 'Account Approvals' },
        { label: this.locale.isRtl() ? 'العملاء' : 'Customers', route: '/admin/accounts/customers' },
        { label: title, active: true },
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
      this.customerId.set(id);
    } else {
      this.router.navigate(['/admin/accounts/customers']);
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab.set(tab as CustomerDetailTab);
  }

  toggleSuspension(): void {
    const cust = this.customer();
    if (!cust) return;

    if (cust.status === 'Suspended') {
      this.stateService.unsuspendCustomer(cust.id);
      this.showToast(
        this.locale.isRtl() ? 'تم إلغاء إيقاف العميل بنجاح' : 'Customer unsuspended successfully',
        'success',
      );
    } else {
      this.stateService.suspendCustomer(cust.id);
      this.showToast(
        this.locale.isRtl() ? 'تم إيقاف العميل مؤقتاً' : 'Customer suspended temporarily',
        'warning',
      );
    }
  }

  toggleFreeze(): void {
    const cust = this.customer();
    if (!cust || !cust.subscriptionId) return;

    this.stateService.toggleCustomerFreeze(cust.id);
    const frozen = cust.status !== 'Frozen';
    this.showToast(
      frozen
        ? this.locale.isRtl()
          ? 'تم تجميد الاشتراك'
          : 'Subscription frozen'
        : this.locale.isRtl()
          ? 'تم إلغاء تجميد الاشتراك'
          : 'Subscription unfrozen',
      frozen ? 'warning' : 'success',
    );
  }

  private showToast(message: string, type: 'success' | 'warning' | 'info'): void {
    this.toastMessage.set(message);
    this.toastType.set(type);
    setTimeout(() => this.toastMessage.set(null), 3000);
  }
}
