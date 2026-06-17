import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { OverviewSnapshotMetric } from '../../models/overview.model';

@Component({
  selector: 'mm-overview-snapshot-strip',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './overview-snapshot-strip.component.html',
  styleUrl: './overview-snapshot-strip.component.scss',
})
export class OverviewSnapshotStripComponent {
  readonly locale = inject(AppLocaleService);
  readonly metrics = input.required<OverviewSnapshotMetric[]>();

  label(metric: OverviewSnapshotMetric): string {
    return this.locale.isRtl() ? metric.labelAr : metric.labelEn;
  }
}
