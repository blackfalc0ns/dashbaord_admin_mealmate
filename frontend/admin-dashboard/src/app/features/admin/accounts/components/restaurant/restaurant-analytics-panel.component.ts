import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { provideIcons, NgIconComponent } from '@ng-icons/core';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { RESTAURANTS_ACCOUNTS_I18N } from '../../../../../core/i18n/translations/restaurants-accounts.i18n';
import { ACCOUNTS_DETAIL_ICONS } from '../../../../../shared/components/accounts/accounts-detail-icons';
import { MmApexChartComponent } from '../../../../../shared/components/apex-chart/mm-apex-chart.component';
import {
  MM_CHART_PALETTE,
  mmBaseChart,
  mmBaseGrid,
  mmBaseLegend,
  mmBaseStroke,
  mmBaseTooltip,
  mmBaseXAxis,
  mmBaseYAxis,
} from '../../../../../shared/components/apex-chart/apex-chart.theme';
import {
  buildRestaurantAnalytics,
  formatKwd,
} from '../../data/accounts-analytics.mock';
import { RestaurantAccount } from '../../models/accounts.model';

@Component({
  selector: 'mm-restaurant-analytics-panel',
  standalone: true,
  imports: [NgIconComponent, MmApexChartComponent],
  templateUrl: './restaurant-analytics-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons(ACCOUNTS_DETAIL_ICONS)],
})
export class RestaurantAnalyticsPanelComponent {
  readonly locale = inject(AppLocaleService);
  readonly restaurant = input.required<RestaurantAccount>();
  readonly copy = computed(() => RESTAURANTS_ACCOUNTS_I18N[this.locale.locale()]);

  readonly analytics = computed(() =>
    buildRestaurantAnalytics(this.restaurant(), this.locale.isRtl()),
  );

  readonly grossLabel = computed(() => formatKwd(this.analytics().grossRevenue));
  readonly commissionLabel = computed(() => formatKwd(this.analytics().platformCommission));
  readonly netLabel = computed(() => formatKwd(this.analytics().netSettlement));
  readonly commissionRateLabel = computed(
    () => `${Math.round(this.analytics().platformCommissionRate * 100)}%`,
  );

  readonly confirmRate = computed(() => this.latestSlaValue(0));
  readonly prepRate = computed(() => this.latestSlaValue(1));

  private latestSlaValue(seriesIndex: number): number {
    const points = this.analytics().slaTrend.series[seriesIndex]?.data ?? [];
    const last = points[points.length - 1];
    return typeof last === 'number' ? last : 0;
  }

  readonly revenueChart = computed(() => {
    const data = this.analytics().weeklyRevenue;
    return {
      series: data.series,
      chart: { ...mmBaseChart('area', 260), stacked: false },
      xaxis: mmBaseXAxis(data.categories),
      yaxis: {
        ...mmBaseYAxis(),
        labels: {
          ...mmBaseYAxis().labels,
          formatter: (v: number) => `${v}`,
        },
      },
      stroke: { ...mmBaseStroke('smooth'), width: 2.5 },
      fill: {
        type: 'gradient',
        gradient: { shadeIntensity: 0.9, opacityFrom: 0.45, opacityTo: 0.05, stops: [0, 90, 100] },
      },
      grid: mmBaseGrid(),
      legend: mmBaseLegend(),
      tooltip: {
        ...mmBaseTooltip(),
        y: { formatter: (v: number) => formatKwd(v) },
      },
      markers: { size: 4, strokeWidth: 0 },
      colors: [MM_CHART_PALETTE[0]],
    };
  });

  readonly mealsChart = computed(() => {
    const data = this.analytics().dailyMeals;
    return {
      series: data.series,
      chart: { ...mmBaseChart('bar', 260), stacked: false },
      xaxis: mmBaseXAxis(data.categories),
      yaxis: mmBaseYAxis(),
      grid: mmBaseGrid(),
      legend: mmBaseLegend(),
      tooltip: mmBaseTooltip(),
      plotOptions: { bar: { borderRadius: 6, columnWidth: '52%' } },
      dataLabels: { enabled: false },
      colors: [MM_CHART_PALETTE[1]],
    };
  });

  readonly settlementChart = computed(() => {
    const data = this.analytics().settlementBreakdown;
    return {
      series: data.series,
      labels: data.labels,
      chart: { ...mmBaseChart('donut', 260) },
      legend: { ...mmBaseLegend(), position: 'bottom' as const },
      tooltip: {
        ...mmBaseTooltip(),
        y: { formatter: (v: number) => formatKwd(v) },
      },
      plotOptions: {
        pie: {
          donut: {
            size: '68%',
            labels: {
              show: true,
              total: {
                show: true,
                label: this.locale.isRtl() ? 'الإجمالي' : 'Total',
                formatter: () => formatKwd(this.analytics().grossRevenue),
              },
            },
          },
        },
      },
      colors: [MM_CHART_PALETTE[0], MM_CHART_PALETTE[2]],
    };
  });

  readonly slaChart = computed(() => {
    const data = this.analytics().slaTrend;
    return {
      series: data.series,
      chart: { ...mmBaseChart('line', 260), stacked: false },
      xaxis: mmBaseXAxis(data.categories),
      yaxis: {
        ...mmBaseYAxis(),
        min: 85,
        max: 100,
        labels: {
          ...mmBaseYAxis().labels,
          formatter: (v: number) => `${v}%`,
        },
      },
      stroke: { ...mmBaseStroke('smooth'), width: 2.5 },
      grid: mmBaseGrid(),
      legend: mmBaseLegend(),
      tooltip: {
        ...mmBaseTooltip(),
        y: { formatter: (v: number) => `${v}%` },
      },
      markers: { size: 4, strokeWidth: 0 },
      colors: [MM_CHART_PALETTE[0], MM_CHART_PALETTE[4]],
    };
  });
}
