import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { provideIcons, NgIconComponent } from '@ng-icons/core';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { DRIVERS_ACCOUNTS_I18N } from '../../../../../core/i18n/translations/drivers-accounts.i18n';
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
import { buildDriverAnalytics } from '../../data/accounts-analytics.mock';
import { DriverAccount } from '../../models/accounts.model';

@Component({
  selector: 'mm-driver-analytics-panel',
  standalone: true,
  imports: [NgIconComponent, MmApexChartComponent],
  templateUrl: './driver-analytics-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons(ACCOUNTS_DETAIL_ICONS)],
})
export class DriverAnalyticsPanelComponent {
  readonly locale = inject(AppLocaleService);
  readonly driver = input.required<DriverAccount>();
  readonly copy = computed(() => DRIVERS_ACCOUNTS_I18N[this.locale.locale()]);

  readonly analytics = computed(() => buildDriverAnalytics(this.driver(), this.locale.isRtl()));

  readonly onTimeRate = computed(() => {
    const points = this.analytics().onTimeTrend.series[0]?.data ?? [];
    const last = points[points.length - 1];
    return typeof last === 'number' ? last : 0;
  });

  readonly deliveriesChart = computed(() => {
    const data = this.analytics().weeklyDeliveries;
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

  readonly dailyDeliveriesChart = computed(() => {
    const data = this.analytics().dailyDeliveries;
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
      colors: [MM_CHART_PALETTE[0]],
    };
  });

  readonly outcomesChart = computed(() => {
    const data = this.analytics().deliveryOutcomes;
    return {
      series: data.series,
      labels: data.labels,
      chart: { ...mmBaseChart('donut', 260) },
      legend: { ...mmBaseLegend(), position: 'bottom' as const },
      tooltip: {
        ...mmBaseTooltip(),
        y: { formatter: (v: number) => `${v}%` },
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
                formatter: () => '100%',
              },
            },
          },
        },
      },
      colors: [MM_CHART_PALETTE[0], MM_CHART_PALETTE[4], MM_CHART_PALETTE[3]],
    };
  });

  readonly onTimeChart = computed(() => {
    const data = this.analytics().onTimeTrend;
    return {
      series: data.series,
      chart: { ...mmBaseChart('line', 260), stacked: false },
      xaxis: mmBaseXAxis(data.categories),
      yaxis: {
        ...mmBaseYAxis(),
        min: 80,
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
      colors: [MM_CHART_PALETTE[0]],
    };
  });
}
