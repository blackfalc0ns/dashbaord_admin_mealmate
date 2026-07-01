import { Component, computed, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCircleAlert,
  lucideEye,
  lucideSearch,
  lucideSnowflake,
  lucideUser,
  lucideUsersRound,
  lucideX,
  lucideChevronRight,
  lucideSlidersHorizontal,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { LIFECYCLE_I18N } from '@/core/i18n/translations/lifecycle.i18n';
import { MmTablePaginationComponent } from '@/shared/components/layout/table-pagination';
import { createTablePagination } from '@/shared/utils/table-pagination.util';
import { SubscriptionsStore } from '../../data/subscriptions-store';
import { FamilyGroupRow, FamilyGroupStatus } from '../../models/lifecycle.model';

type FamilyFilter = 'all' | FamilyGroupStatus;
type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

@Component({
  selector: 'mm-family-subscriptions-workspace-page',
  standalone: true,
  imports: [NgClass, NgIcon, RouterLink, MmTablePaginationComponent],
  providers: [
    provideIcons({
      lucideCircleAlert,
      lucideEye,
      lucideSearch,
      lucideSnowflake,
      lucideUser,
      lucideUsersRound,
      lucideX,
      lucideChevronRight,
      lucideSlidersHorizontal,
    }),
  ],
  templateUrl: './family-subscriptions-workspace-page.component.html',
  host: { class: 'block' },
})
export class FamilySubscriptionsWorkspacePageComponent {
  readonly locale = inject(AppLocaleService);
  readonly store = inject(SubscriptionsStore);

  readonly copy = computed(() => LIFECYCLE_I18N[this.locale.locale()]);
  readonly searchQuery = signal('');
  readonly statusFilter = signal<FamilyFilter>('all');
  readonly detailOpen = signal(false);
  readonly selectedGroup = signal<FamilyGroupRow | null>(null);
  readonly pg = createTablePagination(5);
  readonly currentPage = this.pg.currentPage;
  readonly pageSize = this.pg.pageSize;

  readonly lifecycleStats = computed(() => this.store.lifecycleStats());

  readonly kpis = computed(() => ({
    groups: this.lifecycleStats().familyGroups,
    members: this.lifecycleStats().familyMembers,
    disputes: this.lifecycleStats().familyDisputes,
    pendingDetach: this.lifecycleStats().familyPendingDetach,
  }));

  readonly filteredGroups = computed(() => {
    let rows = this.store.familyGroups();
    const q = this.searchQuery().toLowerCase().trim();
    const st = this.statusFilter();

    if (st !== 'all') {
      rows = rows.filter((r) => r.status === st);
    }
    if (q) {
      rows = rows.filter(
        (r) =>
          r.nameAr.toLowerCase().includes(q) ||
          r.nameEn.toLowerCase().includes(q) ||
          r.managerNameAr.toLowerCase().includes(q) ||
          r.managerNameEn.toLowerCase().includes(q) ||
          r.subscriptionId.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q),
      );
    }
    return rows;
  });

  readonly paginatedGroups = this.pg.paginated(this.filteredGroups);
  readonly totalPages = this.pg.totalPages(this.filteredGroups);

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    this.pg.resetPage();
  }

  setFilter(filter: FamilyFilter): void {
    this.statusFilter.set(filter);
    this.pg.resetPage();
  }

  openDetail(row: FamilyGroupRow): void {
    this.selectedGroup.set(row);
    this.detailOpen.set(true);
  }

  closeDetail(): void {
    this.detailOpen.set(false);
    this.selectedGroup.set(null);
  }

  groupName(row: FamilyGroupRow): string {
    return this.locale.isRtl() ? row.nameAr : row.nameEn;
  }

  managerName(row: FamilyGroupRow): string {
    return this.locale.isRtl() ? row.managerNameAr : row.managerNameEn;
  }

  programBundle(row: FamilyGroupRow): string {
    const program = this.locale.isRtl() ? row.programAr : row.programEn;
    const bundle = this.locale.isRtl() ? row.bundleAr : row.bundleEn;
    return `${program} · ${bundle}`;
  }

  tierLabel(row: FamilyGroupRow): string {
    return this.locale.isRtl() ? row.tierAr : row.tierEn;
  }

  statusLabel(row: FamilyGroupRow): string {
    return this.locale.isRtl() ? row.statusAr : row.statusEn;
  }

  memberName(member: FamilyGroupRow['members'][number]): string {
    return this.locale.isRtl() ? member.nameAr : member.nameEn;
  }

  memberRole(member: FamilyGroupRow['members'][number]): string {
    return this.locale.isRtl() ? member.roleAr : member.roleEn;
  }

  memberStatus(member: FamilyGroupRow['members'][number]): string {
    return this.locale.isRtl() ? member.statusAr : member.statusEn;
  }

  statusTone(status: FamilyGroupStatus): StatusTone {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Frozen':
        return 'info';
      case 'Dispute':
        return 'danger';
      case 'PendingDetach':
        return 'warning';
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

  memberStatusTone(status: FamilyGroupRow['members'][number]['status']): StatusTone {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Pending':
        return 'warning';
      default:
        return 'neutral';
    }
  }

  onPageChange(page: number): void {
    this.pg.onPageChange(page, this.totalPages());
  }
}
