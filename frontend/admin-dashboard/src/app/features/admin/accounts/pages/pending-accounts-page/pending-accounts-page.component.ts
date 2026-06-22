import { Component, computed, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideSearch,
  lucideFilter,
  lucideChevronLeft,
  lucideChevronRight,
  lucideChevronsLeft,
  lucideChevronsRight,
  lucideX,
  lucideCheck,
  lucideUser,
  lucideMail,
  lucidePhone,
  lucideMapPin,
  lucideCar,
  lucideFileText,
  lucideShieldAlert,
  lucideShieldCheck,
  lucideClock,
  lucideSlidersHorizontal,
  lucideArrowUpDown,
} from '@ng-icons/lucide';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { PENDING_ACCOUNTS_I18N } from '../../../../../core/i18n/translations/pending-accounts.i18n';
import { AccountsStateService } from '../../data/accounts-state.service';
import { PendingAccount } from '../../models/accounts.model';

const PENDING_ICONS = {
  lucideSearch,
  lucideFilter,
  lucideChevronLeft,
  lucideChevronRight,
  lucideChevronsLeft,
  lucideChevronsRight,
  lucideX,
  lucideCheck,
  lucideUser,
  lucideMail,
  lucidePhone,
  lucideMapPin,
  lucideCar,
  lucideFileText,
  lucideShieldAlert,
  lucideShieldCheck,
  lucideClock,
  lucideSlidersHorizontal,
  lucideArrowUpDown,
};

@Component({
  selector: 'mm-pending-accounts-page',
  standalone: true,
  imports: [NgClass, NgIcon],
  providers: [provideIcons(PENDING_ICONS)],
  templateUrl: './pending-accounts-page.component.html',
  host: {
    class: 'block',
  },
})
export class PendingAccountsPageComponent {
  readonly locale = inject(AppLocaleService);
  readonly router = inject(Router);
  readonly stateService = inject(AccountsStateService);

  readonly copy = computed(() => PENDING_ACCOUNTS_I18N[this.locale.locale()]);

  // Filters & State
  readonly searchQuery = signal<string>('');
  readonly activeTypeFilter = signal<string>('all');
  readonly activeStatusFilter = signal<string>('all');
  readonly currentPage = signal<number>(1);
  readonly pageSize = signal<number>(5);

  // Computed KPIs based on the mock data in stateService
  readonly kpis = computed(() => {
    const list = this.stateService.accounts();
    const restaurants = list.filter(a => a.type === 'restaurant').length;
    const drivers = list.filter(a => a.type === 'driver').length;
    const ready = list.filter(a => a.statusEn === 'Ready to approve' || a.statusEn === 'Ready for review').length;
    const missing = list.filter(a => a.statusEn === 'Missing documents').length;

    return {
      restaurants,
      drivers,
      ready,
      missing,
    };
  });

  // Filtered & Paginated List
  readonly filteredAccounts = computed(() => {
    let list = this.stateService.accounts();
    const query = this.searchQuery().toLowerCase().trim();
    const type = this.activeTypeFilter();
    const status = this.activeStatusFilter();

    // 1. Search Query
    if (query) {
      list = list.filter(
        a =>
          a.nameEn.toLowerCase().includes(query) ||
          a.nameAr.toLowerCase().includes(query) ||
          a.email.toLowerCase().includes(query) ||
          a.phone.includes(query)
      );
    }

    // 2. Type Filter
    if (type !== 'all') {
      list = list.filter(a => a.type === type);
    }

    // 3. Status Filter
    if (status !== 'all') {
      if (status === 'ready') {
        list = list.filter(a => a.statusEn === 'Ready to approve' || a.statusEn === 'Ready for review');
      } else if (status === 'missing') {
        list = list.filter(a => a.statusEn === 'Missing documents');
      } else if (status === 'review') {
        list = list.filter(a => a.statusEn === 'Under review' || a.statusEn === 'License verification');
      }
    }

    return list;
  });

  readonly paginatedAccounts = computed(() => {
    const list = this.filteredAccounts();
    const page = this.currentPage();
    const size = this.pageSize();
    const start = (page - 1) * size;
    return list.slice(start, start + size);
  });

  readonly totalPages = computed(() => {
    const count = this.filteredAccounts().length;
    return Math.ceil(count / this.pageSize()) || 1;
  });

  // Helpers
  t(ar: string, en: string): string {
    return this.locale.isRtl() ? ar : en;
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
    this.currentPage.set(1); // Reset to first page
  }

  onTypeFilter(type: string): void {
    this.activeTypeFilter.set(type);
    this.currentPage.set(1);
  }

  onStatusFilter(status: string): void {
    this.activeStatusFilter.set(status);
    this.currentPage.set(1);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  openDetails(item: PendingAccount): void {
    this.router.navigate(['/admin/accounts/pending', item.id]);
  }
}
