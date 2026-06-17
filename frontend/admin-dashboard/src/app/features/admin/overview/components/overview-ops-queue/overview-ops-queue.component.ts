import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { ZardCardComponent } from '../../../../../shared/components/card/card.component';
import { OverviewOpsQueueItem } from '../../models/overview.model';

@Component({
  selector: 'mm-overview-ops-queue',
  standalone: true,
  imports: [ZardCardComponent, RouterLink],
  templateUrl: './overview-ops-queue.component.html',
  styleUrl: './overview-ops-queue.component.scss',
})
export class OverviewOpsQueueComponent {
  readonly locale = inject(AppLocaleService);
  readonly items = input.required<OverviewOpsQueueItem[]>();
  readonly titleAr = input('يتطلب إجراء');
  readonly titleEn = input('Needs action');
  readonly descriptionAr = input('أولوية التشغيل الآن');
  readonly descriptionEn = input('Current ops priority');

  cardTitle(): string {
    return this.locale.isRtl() ? this.titleAr() : this.titleEn();
  }

  cardDescription(): string {
    return this.locale.isRtl() ? this.descriptionAr() : this.descriptionEn();
  }

  label(item: OverviewOpsQueueItem): string {
    return this.locale.isRtl() ? item.labelAr : item.labelEn;
  }

  time(item: OverviewOpsQueueItem): string {
    return this.locale.isRtl() ? item.timeAgoAr : item.timeAgoEn;
  }
}
