import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideLayoutDashboard } from '@ng-icons/lucide';

import { BreadcrumbItem } from '@/shared/models/breadcrumb-item.model';

@Component({
  selector: 'mm-breadcrumb',
  standalone: true,
  imports: [NgIcon],
  templateUrl: './breadcrumb.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      lucideChevronRight,
      lucideLayoutDashboard,
    }),
  ],
})
export class MmBreadcrumbComponent {
  readonly homeLabel = input.required<string>();
  readonly homeIcon = input('lucideLayoutDashboard');
  readonly items = input<BreadcrumbItem[]>([]);

  readonly homeClick = output<void>();
}
