import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch, lucidePlus, lucideMegaphone, lucideArrowLeft } from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { AdminPermissions } from '@/core/auth/admin-permissions';
import { HasPermissionDirective } from '@/shared/directives/has-permission.directive';
import { PageStateComponent } from '@/shared/components/page-state/page-state.component';
import { PageViewState } from '@/shared/models/page-view-state.model';
import { MARKETING_I18N, CAMPAIGN_STATUS_LABELS } from '../../i18n/marketing.i18n';
import { MarketingStore } from '../../data/marketing-store';
import { CollaborativeCampaign, CollaborativeCampaignStatus } from '../../models';
import { campaignStatusClasses } from '../../utils/marketing-status.util';
import { totalCampaignCapacity } from '../../utils/collaborative-campaign.util';
import { CampaignFormWizardComponent } from '../../components/campaign-form-wizard/campaign-form-wizard.component';

@Component({
  selector: 'mm-campaigns-list-page',
  standalone: true,
  imports: [
    NgClass,
    DatePipe,
    NgIcon,
    PageStateComponent,
    HasPermissionDirective,
    CampaignFormWizardComponent,
  ],
  providers: [provideIcons({ lucideSearch, lucidePlus, lucideMegaphone, lucideArrowLeft })],
  templateUrl: './campaigns-list-page.component.html',
  host: { class: 'block' },
})
export class CampaignsListPageComponent implements OnInit {
  readonly locale = inject(AppLocaleService);
  readonly router = inject(Router);
  readonly store = inject(MarketingStore);
  readonly perms = AdminPermissions;

  readonly copy = computed(() => MARKETING_I18N[this.locale.locale()]);
  readonly searchQuery = signal('');
  readonly statusFilter = signal<string>('all');
  readonly wizardOpen = signal(false);
  readonly viewState = signal<PageViewState>('loading');

  readonly filtered = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const status = this.statusFilter();
    return this.store.campaigns().filter((c) => {
      if (status !== 'all' && c.status !== status) return false;
      if (!q) return true;
      const name = `${c.nameAr} ${c.nameEn}`.toLowerCase();
      return name.includes(q) || c.id.toLowerCase().includes(q);
    });
  });

  readonly kpis = computed(() => {
    const list = this.store.campaigns();
    return {
      active: list.filter((c) => c.status === 'Active').length,
      open: list.filter((c) => c.status === 'OpenForJoin').length,
      draft: list.filter((c) => c.status === 'Draft').length,
      subscribers: list.reduce((s, c) => s + c.currentSubscribers, 0),
    };
  });

  ngOnInit(): void {
    this.store.load();
    setTimeout(() => {
      this.viewState.set(this.store.campaigns().length ? 'success' : 'empty');
    }, 500);
  }

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  setStatusFilter(id: string): void {
    this.statusFilter.set(id);
  }

  openWizard(): void {
    this.wizardOpen.set(true);
  }

  closeWizard(): void {
    this.wizardOpen.set(false);
  }

  onCreated(id: string): void {
    void this.router.navigate(['/admin/marketing/campaigns', id]);
  }

  openDetail(id: string): void {
    void this.router.navigate(['/admin/marketing/campaigns', id]);
  }

  statusClass(status: string): string {
    return campaignStatusClasses(status);
  }

  statusLabel(status: CollaborativeCampaignStatus): string {
    const labels = CAMPAIGN_STATUS_LABELS[status];
    return this.locale.isRtl() ? labels.ar : labels.en;
  }

  name(c: CollaborativeCampaign): string {
    return this.locale.isRtl() ? c.nameAr : c.nameEn;
  }

  capacity(c: CollaborativeCampaign): number {
    return totalCampaignCapacity(c);
  }
}
