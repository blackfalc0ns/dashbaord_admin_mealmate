import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBadgeCheck,
  lucideCircleAlert,
  lucideClock,
  lucideMessageSquare,
  lucidePackageCheck,
  lucidePhone,
  lucideReceipt,
  lucideStar,
  lucideStore,
  lucideTags,
  lucideTimer,
  lucideTrendingUp,
  lucideUserCheck,
  lucideUserPlus,
  lucideWallet,
  lucideWand,
} from '@ng-icons/lucide';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { MmApexChartComponent } from '../../../../../shared/components/apex-chart/mm-apex-chart.component';
import {
  MM_CHART_COLORS,
  mmSparklineChart,
} from '../../../../../shared/components/apex-chart/apex-chart.theme';
import { OverviewKpiMetric } from '../../models/overview.model';

const KPI_ICONS = {
  lucideTags,
  lucideClock,
  lucidePackageCheck,
  lucideWallet,
  lucideUserCheck,
  lucideCircleAlert,
  lucideMessageSquare,
  lucidePhone,
  lucideUserPlus,
  lucideReceipt,
  lucideTimer,
  lucideStar,
  lucideStore,
  lucideTrendingUp,
  lucideBadgeCheck,
  lucideWand,
};

@Component({
  selector: 'mm-overview-stat-card',
  standalone: true,
  imports: [RouterLink, NgIcon, MmApexChartComponent],
  providers: [provideIcons(KPI_ICONS)],
  templateUrl: './overview-stat-card.component.html',
  styleUrl: './overview-stat-card.component.scss',
})
export class OverviewStatCardComponent {
  readonly locale = inject(AppLocaleService);
  readonly metric = input.required<OverviewKpiMetric>();

  readonly label = computed(() =>
    this.locale.isRtl() ? this.metric().labelAr : this.metric().labelEn,
  );

  readonly deltaPositive = computed(() => this.metric().deltaPercent >= 0);

  readonly sparkSeries = computed(() => [
    { name: 'trend', data: this.metric().sparkline },
  ]);

  readonly sparkChart = { ...mmSparklineChart(), height: 32 };

  readonly sparkColors = [MM_CHART_COLORS.primary];
}
