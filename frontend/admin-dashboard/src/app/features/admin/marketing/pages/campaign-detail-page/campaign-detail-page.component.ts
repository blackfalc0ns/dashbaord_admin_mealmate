import { Component, computed, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucideActivity,
  lucideBan,
  lucideLayers,
  lucideMegaphone,
  lucidePlay,
  lucideRocket,
  lucideSend,
  lucideStore,
  lucideTrendingUp,
  lucideUsers,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { AdminPageContextService } from '@/core/navigation/admin-page-context.service';
import { AdminPermissions } from '@/core/auth/admin-permissions';
import { HasPermissionDirective } from '@/shared/directives/has-permission.directive';
import { DetailTabItem, MmDetailTabNavComponent, MmDetailToastComponent } from '@/shared/components/accounts';
import { MARKETING_I18N, CAMPAIGN_STATUS_LABELS } from '../../i18n/marketing.i18n';
import { MarketingStore } from '../../data/marketing-store';
import { CampaignParticipant, CollaborativeCampaign, CollaborativeCampaignStatus } from '../../models';
import { campaignStatusClasses } from '../../utils/marketing-status.util';
import { canLaunch, capacityMeetsTarget, totalCampaignCapacity } from '../../utils/collaborative-campaign.util';
import { CampaignOverviewPanelComponent } from '../../components/campaign-overview-panel/campaign-overview-panel.component';
import { CampaignProgramsPanelComponent } from '../../components/campaign-programs-panel/campaign-programs-panel.component';
import { CampaignParticipantsPanelComponent } from '../../components/campaign-participants-panel/campaign-participants-panel.component';
import { CampaignReviewPanelComponent } from '../../components/campaign-review-panel/campaign-review-panel.component';
import { CampaignCapacityPanelComponent } from '../../components/campaign-capacity-panel/campaign-capacity-panel.component';
import { CampaignAuditPanelComponent } from '../../components/campaign-audit-panel/campaign-audit-panel.component';
import { CampaignLaunchModalComponent } from '../../components/campaign-launch-modal/campaign-launch-modal.component';
import {
  CampaignActionModalComponent,
  CampaignActionType,
} from '../../components/campaign-action-modal/campaign-action-modal.component';
import { CampaignParticipantModalComponent } from '../../components/campaign-participant-modal/campaign-participant-modal.component';

type CampaignDetailTab = 'overview' | 'programs' | 'participants' | 'review' | 'capacity' | 'audit';
type ModalAction = CampaignActionType | 'launch';

@Component({
  selector: 'mm-campaign-detail-page',
  standalone: true,
  imports: [
    NgClass,
    DatePipe,
    NgIconComponent,
    MmDetailTabNavComponent,
    MmDetailToastComponent,
    HasPermissionDirective,
    CampaignOverviewPanelComponent,
    CampaignProgramsPanelComponent,
    CampaignParticipantsPanelComponent,
    CampaignReviewPanelComponent,
    CampaignCapacityPanelComponent,
    CampaignAuditPanelComponent,
    CampaignLaunchModalComponent,
    CampaignActionModalComponent,
    CampaignParticipantModalComponent,
  ],
  providers: [
    provideIcons({
      lucideMegaphone,
      lucideUsers,
      lucideTrendingUp,
      lucideLayers,
      lucideStore,
      lucideSend,
      lucideRocket,
      lucidePlay,
      lucideBan,
      lucideActivity,
    }),
  ],
  templateUrl: './campaign-detail-page.component.html',
})
export class CampaignDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly locale = inject(AppLocaleService);
  readonly store = inject(MarketingStore);
  private readonly pageContext = inject(AdminPageContextService);
  private readonly destroyRef = inject(DestroyRef);
  readonly perms = AdminPermissions;

  readonly copy = computed(() => MARKETING_I18N[this.locale.locale()]);
  readonly campaignId = signal<string | null>(null);
  readonly activeTab = signal<CampaignDetailTab>('overview');
  readonly toastMessage = signal<string | null>(null);

  readonly launchModalOpen = signal(false);
  readonly actionModalOpen = signal(false);
  readonly actionType = signal<CampaignActionType>('send');
  readonly participantModalOpen = signal(false);
  readonly selectedParticipant = signal<CampaignParticipant | null>(null);

  readonly campaign = computed(() => {
    const id = this.campaignId();
    return id ? (this.store.getCampaignById(id) ?? null) : null;
  });

  readonly totalCapacity = computed(() => {
    const c = this.campaign();
    return c ? totalCampaignCapacity(c) : 0;
  });

  readonly capacityOk = computed(() => {
    const c = this.campaign();
    return c ? capacityMeetsTarget(c) : false;
  });

  readonly canLaunchNow = computed(() => {
    const c = this.campaign();
    return c ? canLaunch(c) : false;
  });

  readonly tabs = computed<DetailTabItem[]>(() => {
    const c = this.copy();
    return [
      { id: 'overview', icon: 'lucideLayoutDashboard', label: c.tabCampaignOverview },
      { id: 'programs', icon: 'lucideLayers', label: c.tabPrograms },
      { id: 'participants', icon: 'lucideStore', label: c.tabParticipants },
      { id: 'review', icon: 'lucideTrendingUp', label: c.tabReview },
      { id: 'capacity', icon: 'lucideUsers', label: c.tabCapacity },
      { id: 'audit', icon: 'lucideActivity', label: c.tabCampaignAudit },
    ];
  });

  constructor() {
    effect(() => {
      const item = this.campaign();
      if (!item) return;
      const name = this.locale.isRtl() ? item.nameAr : item.nameEn;
      this.pageContext.customTitle.set(name);
      this.pageContext.customBreadcrumbs.set([
        { label: this.copy().sectionTitle },
        { label: this.copy().campaigns, route: '/admin/marketing/campaigns' },
        { label: name, active: true },
      ]);
    });
    this.destroyRef.onDestroy(() => {
      this.pageContext.customTitle.set(null);
      this.pageContext.customBreadcrumbs.set(null);
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.campaignId.set(id);
      if (!id || !this.store.getCampaignById(id)) {
        void this.router.navigate(['/admin/marketing/campaigns']);
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab.set(tab as CampaignDetailTab);
  }

  name(item: CollaborativeCampaign): string {
    return this.locale.isRtl() ? item.nameAr : item.nameEn;
  }

  statusLabel(status: CollaborativeCampaignStatus): string {
    const labels = CAMPAIGN_STATUS_LABELS[status];
    return this.locale.isRtl() ? labels.ar : labels.en;
  }

  statusClass(status: CollaborativeCampaignStatus): string {
    return campaignStatusClasses(status);
  }

  commissionLabel(option: CollaborativeCampaign['commissionOption']): string {
    const c = this.copy();
    if (option === 'full') return c.commissionFull;
    if (option === 'half') return c.commissionHalf;
    return c.commissionNone;
  }

  openAction(action: string): void {
    if (action === 'launch') {
      this.launchModalOpen.set(true);
      return;
    }
    this.actionType.set(action as CampaignActionType);
    this.actionModalOpen.set(true);
  }

  closeLaunchModal(): void {
    this.launchModalOpen.set(false);
  }

  closeActionModal(): void {
    this.actionModalOpen.set(false);
  }

  onLaunchConfirmed(_payload: { reason: string }): void {
    const id = this.campaignId();
    if (!id) return;
    if (!this.store.launchCampaign(id)) {
      this.toastMessage.set(this.copy().modalLaunchBlocked);
      return;
    }
    this.toast();
  }

  onActionConfirmed(payload: { reason: string; value?: number }): void {
    const id = this.campaignId();
    if (!id) return;
    const action = this.actionType();
    if (action === 'send') this.store.sendCampaignToRestaurants(id);
    else if (action === 'review') this.store.markCampaignReviewed(id);
    else if (action === 'stop') this.store.stopCampaign(id);
    else if (action === 'redistribute') this.store.redistributeCampaignCapacity(id);
    else if (action === 'increaseCap' && payload.value) {
      this.store.increaseSubscriberCap(id, payload.value, payload.reason);
    }
    this.toast();
  }

  openParticipant(p: CampaignParticipant): void {
    this.selectedParticipant.set(p);
    this.participantModalOpen.set(true);
  }

  closeParticipantModal(): void {
    this.participantModalOpen.set(false);
    this.selectedParticipant.set(null);
  }

  private toast(): void {
    this.toastMessage.set(this.locale.isRtl() ? 'تم تحديث الحملة' : 'Campaign updated');
  }
}
