import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'mm-page-heading',
  standalone: true,
  templateUrl: './page-heading.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MmPageHeadingComponent {
  readonly title = input.required<string>();
  readonly description = input<string | null>(null);
}
