import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideChevronRight,
  lucideCircleAlert,
  lucideCopy,
  lucidePlus,
  lucideSearch,
  lucideSlidersHorizontal,
  lucideUserRound,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { AdminPermissions } from '@/core/auth/admin-permissions';
import { HasPermissionDirective } from '@/shared/directives/has-permission.directive';
import { MmTablePaginationComponent } from '@/shared/components/layout/table-pagination';
import { PageStateComponent } from '@/shared/components/page-state/page-state.component';
import { createTablePagination } from '@/shared/utils/table-pagination.util';
import { PageViewState } from '@/shared/models/page-view-state.model';
import { MARKETING_I18N, INFLUENCER_STATUS_LABELS } from '../../i18n/marketing.i18n';
import { MarketingStore } from '../../data/marketing-store';
import { InfluencerProfile, InfluencerStatus } from '../../models';
import { InfluencerFormWizardComponent } from '../../components/influencer-form-wizard/influencer-form-wizard.component';

type InfluencerFilter = 'all' | InfluencerStatus;
type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

@Component({
  selector: 'mm-influencers-list-page',
  standalone: true,
  imports: [
    NgClass,
    DatePipe,
    NgIcon,
    PageStateComponent,
    HasPermissionDirective,
    InfluencerFormWizardComponent,
    MmTablePaginationComponent,
  ],
  providers: [
    provideIcons({
      lucideChevronRight,
      lucideCircleAlert,
      lucideCopy,
      lucidePlus,
      lucideSearch,
      lucideSlidersHorizontal,
      lucideUserRound,
    }),
  ],
  templateUrl: './influencers-list-page.component.html',
  host: { class: 'block' },
})
export class InfluencersListPageComponent implements OnInit {
  readonly locale = inject(AppLocaleService);
  readonly router = inject(Router);
  readonly store = inject(MarketingStore);
  readonly perms = AdminPermissions;

  readonly copy = computed(() => MARKETING_I18N[this.locale.locale()]);
  readonly searchQuery = signal('');
  readonly statusFilter = signal<InfluencerFilter>('all');
  readonly wizardOpen = signal(false);
  readonly viewState = signal<PageViewState>('loading');
  readonly copiedId = signal<string | null>(null);
  readonly pg = createTablePagination(5);
  readonly currentPage = this.pg.currentPage;
  readonly pageSize = this.pg.pageSize;

  readonly filtered = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const status = this.statusFilter();
    return this.store.influencers().filter((inf) => {
      if (status !== 'all' && inf.status !== status) return false;
      if (!q) return true;
      const name = `${inf.displayNameAr} ${inf.displayNameEn}`.toLowerCase();
      const code = inf.promotionCode?.code?.toLowerCase() ?? '';
      return (
        name.includes(q) ||
        code.includes(q) ||
        inf.contactEmail.toLowerCase().includes(q) ||
        inf.contactPhone.includes(q)
      );
    });
  });

  readonly paginatedInfluencers = this.pg.paginated(this.filtered);
  readonly totalPages = this.pg.totalPages(this.filtered);

  readonly kpis = computed(() => {
    const list = this.store.influencers();
    return {
      active: list.filter((i) => i.status === 'Active').length,
      paused: list.filter((i) => i.status === 'Paused').length,
      draft: list.filter((i) => i.status === 'Draft').length,
      fraud: list.filter((i) => i.status === 'BlockedForFraud').length,
      total: list.length,
    };
  });

  ngOnInit(): void {
    this.store.load();
    setTimeout(() => {
      this.viewState.set(this.store.influencers().length ? 'success' : 'empty');
    }, 450);
  }

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
    this.pg.resetPage();
    this.viewState.set(this.filtered().length ? 'success' : 'empty');
  }

  onStatusFilter(status: InfluencerFilter): void {
    this.statusFilter.set(status);
    this.pg.resetPage();
    this.viewState.set(this.filtered().length ? 'success' : 'empty');
  }

  onPageChange(page: number): void {
    this.pg.onPageChange(page, this.totalPages());
  }

  statusTone(status: InfluencerStatus): StatusTone {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Paused':
        return 'warning';
      case 'BlockedForFraud':
      case 'Suspended':
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

  statusLabel(status: InfluencerStatus): string {
    const labels = INFLUENCER_STATUS_LABELS[status];
    return this.locale.isRtl() ? labels.ar : labels.en;
  }

  displayName(item: InfluencerProfile): string {
    return this.locale.isRtl() ? item.displayNameAr : item.displayNameEn;
  }

  openWizard(): void {
    this.wizardOpen.set(true);
  }

  onWizardClosed(): void {
    this.wizardOpen.set(false);
  }

  onCreated(id: string): void {
    this.wizardOpen.set(false);
    void this.router.navigate(['/admin/marketing/influencers', id]);
  }

  openProfile(item: InfluencerProfile): void {
    void this.router.navigate(['/admin/marketing/influencers', item.id]);
  }

  copyText(text: string, id: string, event?: Event): void {
    event?.stopPropagation();
    void navigator.clipboard?.writeText(text);
    this.copiedId.set(id);
    setTimeout(() => this.copiedId.set(null), 1500);
  }

  retry(): void {
    this.viewState.set('loading');
    this.store.load();
    setTimeout(() => this.viewState.set('success'), 450);
  }
}
