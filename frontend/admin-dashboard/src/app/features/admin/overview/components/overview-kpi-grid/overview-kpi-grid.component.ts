import { Component, computed, input } from '@angular/core';

import { OverviewKpiMetric } from '../../models/overview.model';
import { OverviewStatCardComponent } from '../overview-stat-card/overview-stat-card.component';

@Component({
  selector: 'mm-overview-kpi-grid',
  standalone: true,
  imports: [OverviewStatCardComponent],
  templateUrl: './overview-kpi-grid.component.html',
  styleUrl: './overview-kpi-grid.component.scss',
})
export class OverviewKpiGridComponent {
  readonly kpis = input.required<OverviewKpiMetric[]>();
  readonly kpiIds = input<string[] | null>(null);

  readonly visibleKpis = computed(() => {
    const ids = this.kpiIds();
    if (!ids?.length) {
      return this.kpis();
    }
    return this.kpis().filter((k) => ids.includes(k.id));
  });
}
