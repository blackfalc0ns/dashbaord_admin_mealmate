import { Component, inject, input, output } from '@angular/core';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { OverviewPeriod } from '../../models/overview.model';

const PERIODS: OverviewPeriod[] = ['today', '7d', '30d', 'month'];

@Component({
  selector: 'mm-overview-period-filter',
  standalone: true,
  templateUrl: './overview-period-filter.component.html',
  styleUrl: './overview-period-filter.component.scss',
})
export class OverviewPeriodFilterComponent {
  readonly locale = inject(AppLocaleService);
  readonly selected = input.required<OverviewPeriod>();
  readonly countryLabel = input('');
  readonly updatedAt = input('');
  readonly embedded = input(false);
  readonly periodChange = output<OverviewPeriod>();

  readonly periods = PERIODS;

  label(period: OverviewPeriod): string {
    const map: Record<OverviewPeriod, { ar: string; en: string }> = {
      today: { ar: 'اليوم', en: 'Today' },
      '7d': { ar: '7 أيام', en: '7 days' },
      '30d': { ar: '30 يوم', en: '30 days' },
      month: { ar: 'هذا الشهر', en: 'This month' },
    };
    return this.locale.isRtl() ? map[period].ar : map[period].en;
  }

  select(period: OverviewPeriod): void {
    this.periodChange.emit(period);
  }
}
