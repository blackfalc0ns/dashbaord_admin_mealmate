import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { provideIcons, NgIconComponent } from '@ng-icons/core';

import { ACCOUNTS_DETAIL_ICONS } from '../accounts-detail-icons';
import { detailTabButtonVariants, detailTabNavVariants } from './detail-tab-nav.variants';

export interface DetailTabItem {
  id: string;
  icon: string;
  label: string;
}

@Component({
  selector: 'mm-detail-tab-nav',
  standalone: true,
  imports: [NgIconComponent],
  templateUrl: './detail-tab-nav.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons(ACCOUNTS_DETAIL_ICONS)],
})
export class MmDetailTabNavComponent {
  readonly tabs = input.required<DetailTabItem[]>();
  readonly activeTab = input.required<string>();
  readonly tabChange = output<string>();

  protected readonly navClass = detailTabNavVariants;
  protected readonly buttonClass = detailTabButtonVariants;
}
