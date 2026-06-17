import { Component, computed, input } from '@angular/core';

import { OverviewDomainPanel } from '../../models/overview.model';
import { OverviewDomainPanelComponent } from '../overview-domain-panel/overview-domain-panel.component';

@Component({
  selector: 'mm-overview-domain-panels',
  standalone: true,
  imports: [OverviewDomainPanelComponent],
  templateUrl: './overview-domain-panels.component.html',
  styleUrl: './overview-domain-panels.component.scss',
  host: {
    class: 'block min-w-0',
    '[class.h-full]': 'inline()',
    '[class.mm-overview-domain-panels--inline]': 'inline()',
  },
})
export class OverviewDomainPanelsComponent {
  readonly panels = input.required<OverviewDomainPanel[]>();
  readonly panelIds = input<string[] | null>(null);
  readonly compact = input(false);
  readonly inline = input(false);

  readonly visiblePanels = computed(() => {
    const ids = this.panelIds();
    if (!ids?.length) {
      return this.panels();
    }
    return this.panels().filter((p) => ids.includes(p.id));
  });
}
