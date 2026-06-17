import { Component, inject, input } from '@angular/core';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { OverviewAnalyticsHighlight } from '../../models/overview.model';

@Component({
  selector: 'mm-overview-analytics-highlights',
  standalone: true,
  templateUrl: './overview-analytics-highlights.component.html',
  styleUrl: './overview-analytics-highlights.component.scss',
})
export class OverviewAnalyticsHighlightsComponent {
  readonly locale = inject(AppLocaleService);
  readonly highlights = input.required<OverviewAnalyticsHighlight[]>();

  label(item: OverviewAnalyticsHighlight): string {
    return this.locale.isRtl() ? item.labelAr : item.labelEn;
  }

  hint(item: OverviewAnalyticsHighlight): string {
    return this.locale.isRtl() ? item.hintAr : item.hintEn;
  }
}
