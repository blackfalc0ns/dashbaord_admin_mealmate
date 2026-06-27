import { Component, computed, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideSearch,
  lucideFilter,
  lucideChevronRight,
  lucideX,
  lucideCheck,
  lucideUser,
  lucideMail,
  lucidePhone,
  lucideMapPin,
  lucideFileText,
  lucideShieldAlert,
  lucideShieldCheck,
  lucideClock,
  lucideSlidersHorizontal,
  lucideArrowUpDown,
} from '@ng-icons/lucide';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { RESTAURANTS_ACCOUNTS_I18N } from '../../../../../core/i18n/translations/restaurants-accounts.i18n';
import { MmTablePaginationComponent } from '../../../../../shared/components/layout/table-pagination';
import { AccountsStateService } from '../../data/accounts-state.service';
import { RestaurantAccount } from '../../models/accounts.model';

const RESTAURANT_ICONS = {
  lucideSearch,
  lucideFilter,
  lucideChevronRight,
  lucideX,
  lucideCheck,
  lucideUser,
  lucideMail,
  lucidePhone,
  lucideMapPin,
  lucideFileText,
  lucideShieldAlert,
  lucideShieldCheck,
  lucideClock,
  lucideSlidersHorizontal,
  lucideArrowUpDown,
};

@Component({
  selector: 'mm-restaurants-accounts-page',
  standalone: true,
  imports: [NgClass, NgIcon, MmTablePaginationComponent],
  providers: [provideIcons(RESTAURANT_ICONS)],
  templateUrl: './restaurants-accounts-page.component.html',
  host: {
    class: 'block',
  },
})
export class RestaurantsAccountsPageComponent {
  readonly locale = inject(AppLocaleService);
  readonly router = inject(Router);
  readonly stateService = inject(AccountsStateService);

  readonly copy = computed(() => RESTAURANTS_ACCOUNTS_I18N[this.locale.locale()]);

  // Filters & State
  readonly searchQuery = signal<string>('');
  readonly activeStatusFilter = signal<string>('all');
  readonly currentPage = signal<number>(1);
  readonly pageSize = signal<number>(5);

  // Computed KPIs based on stateService
  readonly kpis = computed(() => {
    const list = this.stateService.restaurants();
    const active = list.filter(r => r.status === 'Active').length;
    const suspended = list.filter(r => r.status === 'Suspended').length;
    const setup = list.filter(r => r.status === 'NeedsOperationalSetup').length;
    const total = list.length;

    return {
      active,
      suspended,
      setup,
      total,
    };
  });

  // Filtered & Paginated List
  readonly filteredRestaurants = computed(() => {
    let list = this.stateService.restaurants();
    const query = this.searchQuery().toLowerCase().trim();
    const status = this.activeStatusFilter();

    // 1. Search Query
    if (query) {
      list = list.filter(
        r =>
          r.nameEn.toLowerCase().includes(query) ||
          r.nameAr.toLowerCase().includes(query) ||
          r.legalNameEn.toLowerCase().includes(query) ||
          r.legalNameAr.toLowerCase().includes(query) ||
          r.crNumber.toLowerCase().includes(query) ||
          r.contactName.toLowerCase().includes(query)
      );
    }

    // 2. Status Filter
    if (status !== 'all') {
      list = list.filter(r => r.status === status);
    }

    return list;
  });

  readonly paginatedRestaurants = computed(() => {
    const list = this.filteredRestaurants();
    const page = this.currentPage();
    const size = this.pageSize();
    const start = (page - 1) * size;
    return list.slice(start, start + size);
  });

  readonly totalPages = computed(() => {
    const count = this.filteredRestaurants().length;
    return Math.ceil(count / this.pageSize()) || 1;
  });

  // Helpers
  t(ar: string, en: string): string {
    return this.locale.isRtl() ? ar : en;
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
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

  openDetails(item: RestaurantAccount): void {
    this.router.navigate(['/admin/accounts/restaurants', item.id]);
  }
}
