import { Component, inject, input } from '@angular/core';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { ZardCardComponent } from '../../../../../shared/components/card/card.component';
import { OverviewTimelineItem } from '../../models/overview.model';

@Component({
  selector: 'mm-overview-timeline',
  standalone: true,
  imports: [ZardCardComponent],
  templateUrl: './overview-timeline.component.html',
  styleUrl: './overview-timeline.component.scss',
})
export class OverviewTimelineComponent {
  readonly locale = inject(AppLocaleService);
  readonly items = input.required<OverviewTimelineItem[]>();

  label(item: OverviewTimelineItem): string {
    return this.locale.isRtl() ? item.labelAr : item.labelEn;
  }

  offset(item: OverviewTimelineItem): string {
    return this.locale.isRtl() ? item.offsetAr : item.offsetEn;
  }

  description(item: OverviewTimelineItem): string {
    return this.locale.isRtl() ? item.descriptionAr : item.descriptionEn;
  }
}
