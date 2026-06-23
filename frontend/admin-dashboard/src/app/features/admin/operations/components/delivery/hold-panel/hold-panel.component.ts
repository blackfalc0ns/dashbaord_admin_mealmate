import { Component, computed, inject, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { HOLD_STATUS_LABELS, OPERATIONS_I18N } from '@/core/i18n/translations/operations.i18n';
import { OperationsStore } from '../../../data/operations-store';
import { HoldCaseStatus } from '../../../models/delivery.model';

@Component({
  selector: 'mm-hold-panel',
  standalone: true,
  imports: [NgIcon],
  providers: [provideIcons({ lucideSearch })],
  templateUrl: './hold-panel.component.html',
})
export class HoldPanelComponent {
  readonly locale = inject(AppLocaleService);
  readonly state = inject(OperationsStore);
  readonly copy = computed(() => OPERATIONS_I18N[this.locale.locale()]);
  readonly searchQuery = signal('');
  readonly toast = signal<string | null>(null);

  readonly filteredCases = computed(() => {
    let cases = this.state.holdCases();
    const q = this.searchQuery().toLowerCase().trim();
    if (q) {
      cases = cases.filter(
        (c) =>
          c.caseId.toLowerCase().includes(q) ||
          c.orderId.toLowerCase().includes(q) ||
          c.customerDisplayName.toLowerCase().includes(q),
      );
    }
    return cases;
  });

  statusLabel(status: HoldCaseStatus): string {
    return HOLD_STATUS_LABELS[this.locale.locale()][status] ?? status;
  }

  resolve(caseId: string): void {
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
