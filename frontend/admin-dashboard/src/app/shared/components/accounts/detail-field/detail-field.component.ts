import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';

import {
  detailFieldIconVariants,
  detailFieldLabelVariants,
  detailFieldValueVariants,
  detailFieldVariants,
} from './detail-field.variants';

@Component({
  selector: 'mm-detail-field',
  standalone: true,
  imports: [NgIconComponent],
  templateUrl: './detail-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
})
export class MmDetailFieldComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly icon = input.required<string>();
  readonly tone = input<'default' | 'success' | 'warning'>('default');
  readonly mono = input(false);
  readonly valueDir = input<'ltr' | 'rtl' | null>(null);

  protected readonly fieldClass = detailFieldVariants;
  protected readonly iconClass = detailFieldIconVariants;
  protected readonly labelClass = detailFieldLabelVariants;
  protected readonly valueClass = detailFieldValueVariants;
}
