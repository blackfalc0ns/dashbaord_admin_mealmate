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
  lucideCar,
  lucideFileText,
  lucideShieldAlert,
  lucideShieldCheck,
  lucideClock,
  lucideSlidersHorizontal,
  lucideArrowUpDown,
} from '@ng-icons/lucide';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { DRIVERS_ACCOUNTS_I18N } from '../../../../../core/i18n/translations/drivers-accounts.i18n';
import { MmTablePaginationComponent } from '../../../../../shared/components/layout/table-pagination';
import { AccountsStateService } from '../../data/accounts-state.service';
import { DriverAccount } from '../../models/accounts.model';

const DRIVER_ICONS = {
  lucideSearch,
  lucideFilter,
  lucideChevronRight,
  lucideX,
  lucideCheck,
  lucideUser,
  lucideMail,
  lucidePhone,
  lucideCar,
  lucideFileText,
  lucideShieldAlert,
  lucideShieldCheck,
  lucideClock,
  lucideSlidersHorizontal,
  lucideArrowUpDown,
};

@Component({
  selector: 'mm-drivers-accounts-page',
  standalone: true,
  imports: [NgClass, NgIcon, MmTablePaginationComponent],
  providers: [provideIcons(DRIVER_ICONS)],
  templateUrl: './drivers-accounts-page.component.html',
  host: {
    class: 'block',
  },
})
export class DriversAccountsPageComponent {
  readonly locale = inject(AppLocaleService);
  readonly router = inject(Router);
  readonly stateService = inject(AccountsStateService);

  readonly copy = computed(() => DRIVERS_ACCOUNTS_I18N[this.locale.locale()]);

  // Filters & State
  readonly searchQuery = signal<string>('');
  readonly activeStatusFilter = signal<string>('all');
  readonly currentPage = signal<number>(1);
  readonly pageSize = signal<number>(5);

  // Computed KPIs based on stateService
  readonly kpis = computed(() => {
    const list = this.stateService.drivers();
    const active = list.filter(d => d.status === 'Active').length;
    const suspended = list.filter(d => d.status === 'Suspended').length;
    const expired = list.filter(d => d.status === 'ExpiredDocuments').length;
    const imageReview = list.filter(d => d.status === 'ProfileImageReviewRequired').length;

    return {
      active,
      suspended,
      expired,
      imageReview,
    };
  });

  // Filtered & Paginated List
  readonly filteredDrivers = computed(() => {
    let list = this.stateService.drivers();
    const query = this.searchQuery().toLowerCase().trim();
    const status = this.activeStatusFilter();

    // 1. Search Query
    if (query) {
      list = list.filter(
        d =>
          d.fullName.toLowerCase().includes(query) ||
          d.phoneNumber.includes(query) ||
          d.email.toLowerCase().includes(query) ||
          d.vehiclePlateNumber.toLowerCase().includes(query)
      );
    }

    // 2. Status Filter
    if (status !== 'all') {
      list = list.filter(d => d.status === status);
    }

    return list;
  });

  readonly paginatedDrivers = computed(() => {
    const list = this.filteredDrivers();
    const page = this.currentPage();
    const size = this.pageSize();
    const start = (page - 1) * size;
    return list.slice(start, start + size);
  });

  readonly totalPages = computed(() => {
    const count = this.filteredDrivers().length;
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

  openDetails(item: DriverAccount): void {
    this.router.navigate(['/admin/accounts/drivers', item.id]);
  }
}
