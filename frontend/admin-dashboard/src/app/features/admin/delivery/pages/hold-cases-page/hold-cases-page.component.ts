import { Component, computed, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch, lucidePhone, lucideCircleAlert } from '@ng-icons/lucide';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import {
  DELIVERY_I18N,
  HOLD_STATUS_LABELS,
} from '../../../../../core/i18n/translations/delivery.i18n';
import { DeliveryStateService } from '../../data/delivery-state.service';
import { HoldCaseStatus } from '../../models/delivery.model';

@Component({
  selector: 'mm-hold-cases-page',
  standalone: true,
  imports: [NgClass, NgIcon],
  providers: [provideIcons({ lucideSearch, lucidePhone, lucideCircleAlert })],
  templateUrl: './hold-cases-page.component.html',
  host: { class: 'block' },
})
export class HoldCasesPageComponent {
  readonly locale = inject(AppLocaleService);
  readonly state = inject(DeliveryStateService);

  readonly copy = computed(() => DELIVERY_I18N[this.locale.locale()]);
  readonly searchQuery = signal('');
  readonly statusFilter = signal<string>('all');
  readonly toast = signal<string | null>(null);

  readonly kpis = computed(() => {
    const cases = this.state.holdCases();
    return {
      active: cases.filter((c) => c.status === 'active').length,
      contactPending: cases.filter((c) => c.status === 'contact_pending').length,
      resolved: cases.filter((c) => c.status === 'resolved').length,
      total: cases.length,
    };
  });

  readonly filteredCases = computed(() => {
    let cases = this.state.holdCases();
    const q = this.searchQuery().toLowerCase().trim();
    const status = this.statusFilter();

    if (q) {
      cases = cases.filter(
        (c) =>
          c.caseId.toLowerCase().includes(q) ||
          c.orderId.toLowerCase().includes(q) ||
          c.customerDisplayName.toLowerCase().includes(q) ||
          c.driverName.toLowerCase().includes(q),
      );
    }

    if (status !== 'all') {
      cases = cases.filter((c) => c.status === status);
    }

    return cases;
  });

  statusLabel(status: HoldCaseStatus): string {
    return HOLD_STATUS_LABELS[this.locale.locale()][status] ?? status;
  }

  resolveCase(caseId: string): void {
    this.state.resolveHoldCase(caseId);
    this.toast.set(`${this.copy().resolve}: ${caseId}`);
    setTimeout(() => this.toast.set(null), 2500);
  }

  logContact(caseId: string): void {
    this.state.recordContactAttempt(caseId);
    this.toast.set(`${this.copy().logContact}: ${caseId}`);
    setTimeout(() => this.toast.set(null), 2500);
  }
}
