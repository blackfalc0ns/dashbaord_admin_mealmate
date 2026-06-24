import { Component, computed, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucideArrowRight,
  lucideBan,
  lucideCopy,
  lucideMail,
  lucideMegaphone,
  lucidePause,
  lucidePhone,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { AdminPageContextService } from '@/core/navigation/admin-page-context.service';
import { AdminPermissions } from '@/core/auth/admin-permissions';
import { HasPermissionDirective } from '@/shared/directives/has-permission.directive';
import {
  DetailTabItem,
  MmDetailTabNavComponent,
  MmDetailToastComponent,
} from '@/shared/components/accounts';
import { MARKETING_I18N, INFLUENCER_STATUS_LABELS } from '../../i18n/marketing.i18n';
import { MarketingStore } from '../../data/marketing-store';
import { InfluencerProfile, InfluencerStatus } from '../../models';
import { influencerStatusClasses } from '../../utils/marketing-status.util';
import { InfluencerOverviewPanelComponent } from '../../components/influencer-overview-panel/influencer-overview-panel.component';
import { InfluencerProfilePanelComponent } from '../../components/influencer-profile-panel/influencer-profile-panel.component';
import { InfluencerPromotionPanelComponent } from '../../components/influencer-promotion-panel/influencer-promotion-panel.component';
import { InfluencerCommissionPanelComponent } from '../../components/influencer-commission-panel/influencer-commission-panel.component';
import { InfluencerAttributionsPanelComponent } from '../../components/influencer-attributions-panel/influencer-attributions-panel.component';
import { InfluencerCommissionsPanelComponent } from '../../components/influencer-commissions-panel/influencer-commissions-panel.component';
import { InfluencerAuditPanelComponent } from '../../components/influencer-audit-panel/influencer-audit-panel.component';

type InfluencerDetailTab =
  | 'overview'
  | 'profile'
  | 'promotion'
  | 'commission'
  | 'attributions'
  | 'commissions'
  | 'audit';

@Component({
  selector: 'mm-influencer-detail-page',
  standalone: true,
  imports: [
    NgClass,
    DatePipe,
    NgIconComponent,
    MmDetailTabNavComponent,
    MmDetailToastComponent,
    HasPermissionDirective,
    InfluencerOverviewPanelComponent,
    InfluencerProfilePanelComponent,
    InfluencerPromotionPanelComponent,
    InfluencerCommissionPanelComponent,
    InfluencerAttributionsPanelComponent,
    InfluencerCommissionsPanelComponent,
    InfluencerAuditPanelComponent,
  ],
  providers: [
    provideIcons({
      lucideCopy,
      lucidePause,
      lucideBan,
      lucidePhone,
      lucideMail,
      lucideMegaphone,
      lucideArrowRight,
    }),
  ],
  templateUrl: './influencer-detail-page.component.html',
})
export class InfluencerDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly locale = inject(AppLocaleService);
  readonly store = inject(MarketingStore);
  private readonly pageContext = inject(AdminPageContextService);
  private readonly destroyRef = inject(DestroyRef);
  readonly perms = AdminPermissions;

  readonly copy = computed(() => MARKETING_I18N[this.locale.locale()]);
  readonly influencerId = signal<string | null>(null);
  readonly activeTab = signal<InfluencerDetailTab>('overview');
  readonly toastMessage = signal<string | null>(null);
  readonly newCommissionRate = signal(10);

  readonly influencer = computed(() => {
    const id = this.influencerId();
    return id ? this.store.getInfluencerById(id) ?? null : null;
  });

  readonly tabs = computed<DetailTabItem[]>(() => {
    const c = this.copy();
    return [
      { id: 'overview', icon: 'lucideLayoutDashboard', label: c.tabOverview },
      { id: 'profile', icon: 'lucideUser', label: c.tabProfile },
      { id: 'promotion', icon: 'lucideGlobe', label: c.tabPromotion },
      { id: 'commission', icon: 'lucideDollarSign', label: c.tabCommission },
      { id: 'attributions', icon: 'lucideUsers', label: c.tabAttributions },
      { id: 'commissions', icon: 'lucideWallet', label: c.tabCommissions },
      { id: 'audit', icon: 'lucideActivity', label: c.tabAudit },
    ];
  });

  constructor() {
    effect(() => {
      const item = this.influencer();
      if (!item) return;
      const name = this.displayName(item);
      this.pageContext.customTitle.set(name);
      this.pageContext.customBreadcrumbs.set([
        { label: this.copy().sectionTitle },
        { label: this.copy().influencers, route: '/admin/marketing/influencers' },
        { label: name, active: true },
      ]);
      this.newCommissionRate.set(item.defaultCommissionRate);
    });

    this.destroyRef.onDestroy(() => {
      this.pageContext.customTitle.set(null);
      this.pageContext.customBreadcrumbs.set(null);
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.influencerId.set(id);
      if (!id || !this.store.getInfluencerById(id)) {
        void this.router.navigate(['/admin/marketing/influencers']);
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab.set(tab as InfluencerDetailTab);
  }

  displayName(item: InfluencerProfile): string {
    return this.locale.isRtl() ? item.displayNameAr : item.displayNameEn;
  }

  initials(item: InfluencerProfile): string {
    const name = this.displayName(item);
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }

  statusLabel(status: InfluencerStatus): string {
    const labels = INFLUENCER_STATUS_LABELS[status];
    return this.locale.isRtl() ? labels.ar : labels.en;
  }

  statusClass(status: InfluencerStatus): string {
    return influencerStatusClasses(status);
  }

  setStatus(status: InfluencerStatus): void {
    const id = this.influencerId();
    if (!id) return;
    this.store.updateInfluencerStatus(id, status);
    this.toastMessage.set(this.locale.isRtl() ? 'تم تحديث الحالة' : 'Status updated');
  }

  saveCommissionRate(): void {
    const id = this.influencerId();
    if (!id) return;
    this.store.updateCommissionRate(id, this.newCommissionRate());
    this.toastMessage.set(this.locale.isRtl() ? 'تم تحديث نسبة العمولة' : 'Commission rate updated');
  }

  copyText(text: string): void {
    void navigator.clipboard?.writeText(text);
    this.toastMessage.set(this.copy().copied);
  }
}
