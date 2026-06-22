import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { provideIcons, NgIconComponent } from '@ng-icons/core';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { DRIVERS_ACCOUNTS_I18N } from '../../../../../core/i18n/translations/drivers-accounts.i18n';
import { ACCOUNTS_DETAIL_ICONS } from '../../../../../shared/components/accounts/accounts-detail-icons';
import { docStatusLabel, t as translate } from '../../../../../shared/components/accounts/accounts-detail.utils';
import { DriverAccount } from '../../models/accounts.model';

@Component({
  selector: 'mm-driver-details-panel',
  standalone: true,
  imports: [NgClass, NgIconComponent, RouterLink],
  templateUrl: './driver-details-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons(ACCOUNTS_DETAIL_ICONS)],
})
export class DriverDetailsPanelComponent {
  readonly locale = inject(AppLocaleService);
  readonly driver = input.required<DriverAccount>();
  readonly copy = computed(() => DRIVERS_ACCOUNTS_I18N[this.locale.locale()]);

  readonly selectedDocId = signal<string | null>(null);

  readonly selectedDoc = computed(() => {
    const item = this.driver();
    const docId = this.selectedDocId();
    if (!item.documents.length) return null;
    if (!docId) return item.documents[0];
    return item.documents.find((d) => d.id === docId) ?? item.documents[0];
  });

  constructor() {
    effect(() => {
      const item = this.driver();
      if (item.documents.length && !this.selectedDocId()) {
        this.selectedDocId.set(item.documents[0].id);
      }
    });
  }

  protected t(ar: string, en: string): string {
    return translate(this.locale, ar, en);
  }

  protected docStatusLabel(status: string): string {
    return docStatusLabel(this.locale, status as Parameters<typeof docStatusLabel>[1]);
  }
}
