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
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { LIFECYCLE_I18N } from '@/core/i18n/translations/lifecycle.i18n';
import { MmOperationsKpiCardComponent } from '@/shared/components/operations';
import { MmTablePaginationComponent } from '@/shared/components/layout/table-pagination';
import { createTablePagination } from '@/shared/utils/table-pagination.util';
import { SubscriptionsStore } from '../../data/subscriptions-store';
import { FamilyGroupRow, FamilyGroupStatus } from '../../models/lifecycle.model';

type FamilyFilter = 'all' | FamilyGroupStatus;

@Component({
  selector: 'mm-family-subscriptions-workspace-page',
  standalone: true,
  imports: [
    NgClass,
    NgIcon,
    RouterLink,
    MmOperationsKpiCardComponent,
    MmTablePaginationComponent,
  ],
  providers: [
    provideIcons({
      lucideCircleAlert,
      lucideEye,
      lucideSearch,
      lucideSnowflake,
      lucideUser,
      lucideUsersRound,
      lucideX,
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
  readonly pg = createTablePagination(8);
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

  readonly paginatedGroups = computed(() => {
    const rows = this.filteredGroups();
    const start = (this.currentPage() - 1) * this.pageSize();
    return rows.slice(start, start + this.pageSize());
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredGroups().length / this.pageSize())),
  );

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

  statusClass(status: FamilyGroupStatus): string {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
      case 'Frozen':
        return 'bg-sky-50 text-sky-700 ring-sky-200';
      case 'Dispute':
        return 'bg-red-50 text-red-700 ring-red-200';
      case 'PendingDetach':
        return 'bg-amber-50 text-amber-700 ring-amber-200';
      default:
        return 'bg-slate-100 text-slate-600 ring-slate-200';
    }
  }

  memberStatusClass(status: FamilyGroupRow['members'][number]['status']): string {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 ring-amber-200';
      case 'Detached':
        return 'bg-slate-100 text-slate-600 ring-slate-200';
      default:
        return 'bg-slate-100 text-slate-600 ring-slate-200';
    }
  }

  onPageChange(page: number): void {
    this.pg.onPageChange(page, this.totalPages());
  }
}
