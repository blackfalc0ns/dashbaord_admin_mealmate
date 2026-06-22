import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';

import { detailStatCardVariants, detailStatIconVariants } from './detail-stat-card.variants';

@Component({
  selector: 'mm-detail-stat-card',
  standalone: true,
  imports: [NgIconComponent],
  templateUrl: './detail-stat-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MmDetailStatCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly icon = input.required<string>();
  readonly tone = input<'emerald' | 'blue' | 'amber' | 'purple'>('emerald');

  protected readonly cardClass = detailStatCardVariants;
  protected readonly iconClass = detailStatIconVariants;
}
