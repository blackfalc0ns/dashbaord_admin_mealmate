import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideSearch,
  lucidePlus,
  lucideCopy,
  lucideExternalLink,
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
import { influencerStatusClasses } from '../../utils/marketing-status.util';
import { InfluencerFormWizardComponent } from '../../components/influencer-form-wizard/influencer-form-wizard.component';

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
  providers: [provideIcons({ lucideSearch, lucidePlus, lucideCopy, lucideExternalLink, lucideUserRound })],
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
  readonly statusFilter = signal<string>('all');
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
  readonly paginationItems = computed(() => (this.locale.isRtl() ? 'مؤثر' : 'influencers'));

  readonly kpis = computed(() => {
    const list = this.store.influencers();
    return {
      active: list.filter((i) => i.status === 'Active').length,
      paused: list.filter((i) => i.status === 'Paused').length,
      draft: list.filter((i) => i.status === 'Draft').length,
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
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    this.pg.resetPage();
    this.viewState.set(this.filtered().length ? 'success' : 'empty');
  }

  onStatusFilter(status: string): void {
    this.statusFilter.set(status);
    this.pg.resetPage();
    this.viewState.set(this.filtered().length ? 'success' : 'empty');
  }

  onPageChange(page: number): void {
    this.pg.onPageChange(page, this.totalPages());
  }

  statusLabel(status: InfluencerStatus): string {
    const labels = INFLUENCER_STATUS_LABELS[status];
    return this.locale.isRtl() ? labels.ar : labels.en;
  }

  statusClass(status: InfluencerStatus): string {
    return influencerStatusClasses(status);
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
    this.router.navigate(['/admin/marketing/influencers', id]);
  }

  openProfile(item: InfluencerProfile): void {
    this.router.navigate(['/admin/marketing/influencers', item.id]);
  }

  copyText(text: string, id: string): void {
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
