import { Component, computed, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideSearch,
  lucideChevronLeft,
  lucideChevronRight,
  lucideChevronsLeft,
  lucideChevronsRight,
  lucideUser,
  lucideShieldAlert,
  lucideShieldCheck,
  lucideSnowflake,
  lucideUserX,
  lucideSlidersHorizontal,
  lucideUsers,
} from '@ng-icons/lucide';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { CUSTOMERS_ACCOUNTS_I18N } from '../../../../../core/i18n/translations/customers-accounts.i18n';
import { AccountsStateService } from '../../data/accounts-state.service';
import { CustomerAccount } from '../../models/accounts.model';

const CUSTOMER_ICONS = {
  lucideSearch,
  lucideChevronLeft,
  lucideChevronRight,
  lucideChevronsLeft,
  lucideChevronsRight,
  lucideUser,
  lucideShieldAlert,
  lucideShieldCheck,
  lucideSnowflake,
  lucideUserX,
  lucideSlidersHorizontal,
  lucideUsers,
};

@Component({
  selector: 'mm-customers-accounts-page',
  standalone: true,
  imports: [NgClass, NgIcon],
  providers: [provideIcons(CUSTOMER_ICONS)],
  templateUrl: './customers-accounts-page.component.html',
  host: { class: 'block' },
})
export class CustomersAccountsPageComponent {
  readonly locale = inject(AppLocaleService);
  readonly router = inject(Router);
  readonly stateService = inject(AccountsStateService);

  readonly copy = computed(() => CUSTOMERS_ACCOUNTS_I18N[this.locale.locale()]);

  readonly searchQuery = signal<string>('');
  readonly activeStatusFilter = signal<string>('all');
  readonly currentPage = signal<number>(1);
  readonly pageSize = signal<number>(5);

  readonly kpis = computed(() => {
    const list = this.stateService.customers();
    return {
      active: list.filter((c) => c.status === 'Active').length,
      frozen: list.filter((c) => c.status === 'Frozen').length,
      noSubscription: list.filter((c) => c.status === 'NoSubscription').length,
      suspended: list.filter((c) => c.status === 'Suspended').length,
    };
  });

  readonly filteredCustomers = computed(() => {
    let list = this.stateService.customers();
    const query = this.searchQuery().toLowerCase().trim();
    const status = this.activeStatusFilter();

    if (query) {
      list = list.filter(
        (c) =>
          c.nameAr.toLowerCase().includes(query) ||
          c.nameEn.toLowerCase().includes(query) ||
          c.phoneNumber.includes(query) ||
          c.email.toLowerCase().includes(query) ||
          c.id.toLowerCase().includes(query),
      );
    }

    if (status !== 'all') {
      list = list.filter((c) => c.status === status);
    }

    return list;
  });

  readonly paginatedCustomers = computed(() => {
    const list = this.filteredCustomers();
    const page = this.currentPage();
    const size = this.pageSize();
    const start = (page - 1) * size;
    return list.slice(start, start + size);
  });

  readonly totalPages = computed(() => {
    const count = this.filteredCustomers().length;
    return Math.ceil(count / this.pageSize()) || 1;
  });

  t(ar: string, en: string): string {
    return this.locale.isRtl() ? ar : en;
  }

  customerName(item: CustomerAccount): string {
    return this.t(item.nameAr, item.nameEn);
  }

  subscriptionLabel(item: CustomerAccount): string {
    if (!item.subscriptionId) return this.copy().noActiveSubscription;
    const program = this.t(item.programAr ?? '', item.programEn ?? '');
    const bundle = this.t(item.bundleAr ?? '', item.bundleEn ?? '');
    const tier = this.t(item.tierAr ?? '', item.tierEn ?? '');
    return `${program} · ${bundle} · ${tier}`;
  }

  isFamilySubscription(item: CustomerAccount): boolean {
    return item.subscriptionType === 'Family';
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

  openDetails(item: CustomerAccount): void {
    this.router.navigate(['/admin/accounts/customers', item.id]);
  }
}
