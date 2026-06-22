import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';

import {
  detailPanelCardVariants,
  detailPanelHeaderVariants,
  detailPanelSubtitleVariants,
} from './detail-panel-card.variants';

@Component({
  selector: 'mm-detail-panel-card',
  standalone: true,
  imports: [NgIconComponent],
  templateUrl: './detail-panel-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MmDetailPanelCardComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string | null>(null);
  readonly icon = input<string | null>(null);
  readonly iconClass = input('text-emerald-600');

  protected readonly cardClass = detailPanelCardVariants;
  protected readonly headerClass = detailPanelHeaderVariants;
  protected readonly subtitleClass = detailPanelSubtitleVariants;
}
