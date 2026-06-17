import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { shellCardVariants } from './shell-card.variants';

@Component({
  selector: 'mm-shell-card',
  standalone: true,
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
  },
})
export class MmShellCardComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses('mm-shell-card', shellCardVariants(), this.class()),
  );
}
