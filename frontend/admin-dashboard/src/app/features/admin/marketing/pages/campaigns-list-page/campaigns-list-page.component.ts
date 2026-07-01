import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideChevronRight,
  lucideMegaphone,
  lucidePlus,
  lucideSearch,
  lucideSlidersHorizontal,
  lucideTrendingUp,
  lucideUsers,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { AdminPermissions } from '@/core/auth/admin-permissions';
import { HasPermissionDirective } from '@/shared/directives/has-permission.directive';
import { MmTablePaginationComponent } from '@/shared/components/layout/table-pagination';
import { PageStateComponent } from '@/shared/components/page-state/page-state.component';
import { createTablePagination } from '@/shared/utils/table-pagination.util';
import { PageViewState } from '@/shared/models/page-view-state.model';
import { MARKETING_I18N, CAMPAIGN_STATUS_LABELS } from '../../i18n/marketing.i18n';
import { MarketingStore } from '../../data/marketing-store';
import { CollaborativeCampaign, CollaborativeCampaignStatus } from '../../models';
import { totalCampaignCapacity } from '../../utils/collaborative-campaign.util';
import { CampaignFormWizardComponent } from '../../components/campaign-form-wizard/campaign-form-wizard.component';

type CampaignFilter = 'all' | CollaborativeCampaignStatus;
type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

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
    MmTablePaginationComponent,
  ],
  providers: [
    provideIcons({
      lucideChevronRight,
      lucideMegaphone,
      lucidePlus,
      lucideSearch,
      lucideSlidersHorizontal,
      lucideTrendingUp,
      lucideUsers,
    }),
  ],
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
  readonly statusFilter = signal<CampaignFilter>('all');
  readonly wizardOpen = signal(false);
  readonly viewState = signal<PageViewState>('loading');
  readonly pg = createTablePagination(5);
  readonly currentPage = this.pg.currentPage;
  readonly pageSize = this.pg.pageSize;

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

  readonly paginatedCampaigns = this.pg.paginated(this.filtered);
  readonly totalPages = this.pg.totalPages(this.filtered);

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
    this.pg.resetPage();
  }

  setStatusFilter(id: CampaignFilter): void {
    this.statusFilter.set(id);
    this.pg.resetPage();
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

  onPageChange(page: number): void {
    this.pg.onPageChange(page, this.totalPages());
  }

  statusTone(status: CollaborativeCampaignStatus): StatusTone {
    switch (status) {
      case 'Active':
        return 'success';
      case 'OpenForJoin':
        return 'info';
      case 'Reviewed':
        return 'info';
      case 'Stopped':
        return 'danger';
      default:
        return 'neutral';
    }
  }

  statusBadgeClass(tone: StatusTone): string {
    switch (tone) {
      case 'success':
        return 'bg-emerald-50 text-emerald-700 ring-emerald-600/15';
      case 'warning':
        return 'bg-amber-50 text-amber-700 ring-amber-600/15';
      case 'danger':
        return 'bg-rose-50 text-rose-700 ring-rose-600/15';
      case 'info':
        return 'bg-sky-50 text-sky-700 ring-sky-600/15';
      default:
        return 'bg-slate-50 text-slate-700 ring-slate-600/15';
    }
  }

  statusDotClass(tone: StatusTone): string {
    switch (tone) {
      case 'success':
        return 'bg-emerald-500';
      case 'warning':
        return 'bg-amber-500';
      case 'danger':
        return 'bg-rose-500';
      case 'info':
        return 'bg-sky-500';
      default:
        return 'bg-slate-400';
    }
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

  subscriberProgress(c: CollaborativeCampaign): number {
    if (!c.maxSubscribers) return 0;
    return Math.min(100, Math.round((c.currentSubscribers / c.maxSubscribers) * 100));
  }
}
