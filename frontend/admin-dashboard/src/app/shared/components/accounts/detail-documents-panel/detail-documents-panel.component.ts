import { ChangeDetectionStrategy, Component, computed, inject, input, model } from '@angular/core';
import { NgClass } from '@angular/common';
import { NgIconComponent } from '@ng-icons/core';

import { AppLocaleService } from '../../../../core/i18n/app-locale.service';
import { AccountDocument } from '../../../../features/admin/accounts/models/accounts.model';
import { docStatusLabel, t } from '../accounts-detail.utils';
import { MmDetailPanelCardComponent } from '../detail-panel-card/detail-panel-card.component';
import { detailDocItemVariants, detailDocStatusVariants } from './detail-documents-panel.variants';

@Component({
  selector: 'mm-detail-documents-panel',
  standalone: true,
  imports: [NgClass, NgIconComponent, MmDetailPanelCardComponent],
  templateUrl: './detail-documents-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MmDetailDocumentsPanelComponent {
  readonly locale = inject(AppLocaleService);

  readonly title = input.required<string>();
  readonly subtitle = input<string | null>(null);
  readonly documents = input.required<AccountDocument[]>();
  readonly entityLabel = input.required<string>();
  readonly entityRef = input.required<string>();
  readonly previewRows = input<Array<{ label: string; value: string; mono?: boolean }>>([]);

  readonly selectedDocId = model<string | null>(null);

  readonly selectedDoc = computed(() => {
    const docs = this.documents();
    const id = this.selectedDocId();
    if (!docs.length) return null;
    if (!id) return docs[0];
    return docs.find((d) => d.id === id) ?? docs[0];
  });

  protected readonly docItemClass = detailDocItemVariants;
  protected readonly docStatusClass = detailDocStatusVariants;

  protected statusLabel(status: AccountDocument['status']): string {
    return docStatusLabel(this.locale, status);
  }

  protected tr(ar: string, en: string): string {
    return t(this.locale, ar, en);
  }
}
