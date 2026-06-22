import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { provideIcons, NgIconComponent } from '@ng-icons/core';

import { ACCOUNTS_DETAIL_ICONS } from '../accounts-detail-icons';
import { detailToastVariants } from './detail-toast.variants';

@Component({
  selector: 'mm-detail-toast',
  standalone: true,
  imports: [NgIconComponent],
  templateUrl: './detail-toast.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons(ACCOUNTS_DETAIL_ICONS)],
})
export class MmDetailToastComponent {
  readonly message = input.required<string>();
  readonly type = input<'success' | 'warning' | 'info'>('success');

  protected readonly toastClass = detailToastVariants;
}
