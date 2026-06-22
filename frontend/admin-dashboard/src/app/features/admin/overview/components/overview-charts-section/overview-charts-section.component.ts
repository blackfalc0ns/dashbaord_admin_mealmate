import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight } from '@ng-icons/lucide';
import type { ApexAxisChartSeries, ApexNonAxisChartSeries } from 'ng-apexcharts';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { ZardCardComponent } from '../../../../../shared/components/card/card.component';
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
import { OverviewChartPanel, OverviewChartStat } from '../../models/overview.model';
import {
  overviewChartBodyVariants,
  overviewChartCardVariants,
  overviewChartDetailsLinkIconVariants,
  overviewChartDetailsLinkVariants,
  overviewChartsRowVariants,
  overviewChartsShellVariants,
  mergeOverviewChartCardClasses,
} from './overview-charts-section.variants';

interface ChartGroup {
  key: string;
  title: string;
  charts: OverviewChartPanel[];
}

@Component({
  selector: 'mm-overview-charts-section',
  standalone: true,
  imports: [ZardCardComponent, MmApexChartComponent, RouterLink, NgIcon],
  providers: [provideIcons({ lucideArrowRight })],
  templateUrl: './overview-charts-section.component.html',
  styleUrl: './overview-charts-section.component.scss',
  host: {
    class: 'block min-w-0 w-full',
    '[class.h-full]': 'inline()',
    '[class.min-h-0]': 'inline()',
    '[class.mm-overview-charts-host--inline]': 'inline()',
    '[class.mm-overview-charts-host--analytics]': 'mode() === "analytics"',
  },
})
export class OverviewChartsSectionComponent {
  readonly locale = inject(AppLocaleService);
  readonly charts = input.required<OverviewChartPanel[]>();
  readonly chartIds = input<string[] | null>(null);
  readonly layout = input<'featured' | 'grid'>('featured');
  readonly density = input<'default' | 'compact'>('default');
  readonly inline = input(false);
  readonly mode = input<'default' | 'analytics'>('default');

  readonly filteredCharts = computed(() => {
    const ids = this.chartIds();
    if (!ids?.length) {
      return this.charts();
    }
    return this.charts().filter((c) => ids.includes(c.id));
  });

  readonly chartGroups = computed((): ChartGroup[] | null => {
    if (this.mode() !== 'analytics') {
      return null;
    }

    const groups = new Map<string, ChartGroup>();
    for (const chart of this.filteredCharts()) {
      const key = this.chartGroupKey(chart, this.filteredCharts());
      const title = this.locale.isRtl()
        ? (chart.groupAr ?? chart.groupEn ?? 'عام')
        : (chart.groupEn ?? chart.groupAr ?? 'General');

      const existing = groups.get(key);
      if (existing) {
        existing.charts.push(chart);
      } else {
        groups.set(key, { key, title, charts: [chart] });
      }
    }

    for (const group of groups.values()) {
      group.charts.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    }

    return Array.from(groups.values());
  });

  private chartGroupKey(chart: OverviewChartPanel, charts: OverviewChartPanel[]): string {
    if (chart.mergePair) {
      const hasPartner = charts.some(
        (item) => item.id !== chart.id && item.mergePair === chart.mergePair,
      );
      if (hasPartner) {
        return chart.mergePair;
      }
    }

    if (this.locale.isRtl()) {
      return chart.standaloneGroupAr ?? chart.groupAr ?? chart.groupEn ?? 'general';
    }

    return chart.standaloneGroupEn ?? chart.groupEn ?? chart.groupAr ?? 'general';
  }

  isMergedGroup(group: ChartGroup): boolean {
    return group.charts.some((chart) => chart.merged === true);
  }

  mergedTitleParts(group: ChartGroup): string[] {
    const raw = this.locale.isRtl()
      ? (group.charts[0]?.groupAr ?? group.title)
      : (group.charts[0]?.groupEn ?? group.title);
    return raw.split(' · ').map((part) => part.trim()).filter(Boolean);
  }

  groupGridClass(group: ChartGroup): string {
    const hasFull = group.charts.some((chart) => chart.span === 'full');
    const count = group.charts.length;

    if (count === 1) {
      return 'mm-overview-analytics__grid--cols-1';
    }
    if (count === 3 && !hasFull) {
      return 'mm-overview-analytics__grid--cols-3';
    }
    return 'mm-overview-analytics__grid--cols-2';
  }

  isFullWidth(panel: OverviewChartPanel, group: ChartGroup): boolean {
    if (panel.span === 'full') {
      return true;
    }
    const gridClass = this.groupGridClass(group);
    if (gridClass === 'mm-overview-analytics__grid--cols-3') {
      return false;
    }
    if (group.charts.length === 3 && group.charts.indexOf(panel) === 2) {
      return true;
    }
    return false;
  }

  readonly largeCharts = computed(() => {
    const all = this.filteredCharts();
    if (this.layout() === 'grid' || all.length <= 2) {
      return all;
    }
    return all.slice(0, 2);
  });

  readonly smallCharts = computed(() => {
    const all = this.filteredCharts();
    if (this.layout() === 'grid' || all.length <= 2) {
      return [];
    }
    return all.slice(2);
  });

  title(panel: OverviewChartPanel): string {
    return this.locale.isRtl() ? panel.titleAr : panel.titleEn;
  }

  description(panel: OverviewChartPanel): string {
    return this.locale.isRtl() ? panel.descriptionAr : panel.descriptionEn;
  }

  statLabel(stat: OverviewChartStat): string {
    return this.locale.isRtl() ? stat.labelAr : stat.labelEn;
  }

  detailsLabel(): string {
    return this.locale.isRtl() ? 'عرض التفاصيل' : 'View details';
  }

  detailsLinkClass(analytics: boolean, merged: boolean): string {
    return overviewChartDetailsLinkVariants({ analytics, merged });
  }

  detailsLinkIconClass(analytics: boolean): string {
    return overviewChartDetailsLinkIconVariants({
      size: analytics ? 'compact' : 'default',
    });
  }

  chartsShellClass(): string {
    return overviewChartsShellVariants({
      compact: this.density() === 'compact',
      inline: this.inline(),
    });
  }

  chartsRowClass(): string {
    const solo = this.filteredCharts().length === 1;

    if (this.inline()) {
      return overviewChartsRowVariants({
        grid: false,
        solo,
        inline: true,
      });
    }

    return overviewChartsRowVariants({
      grid: this.layout() === 'grid',
      solo,
      inline: false,
    });
  }

  chartCardClass(panel: OverviewChartPanel): string {
    const compact = this.density() === 'compact';
    return mergeOverviewChartCardClasses(panel, compact, this.inline(), this.layout(), this.filteredCharts().length);
  }

  chartBodyClass(panel: OverviewChartPanel): string {
    return overviewChartBodyVariants({
      compact: this.density() === 'compact',
      donut: panel.chartType === 'donut',
      inline: this.inline(),
    });
  }

  chartConfig(panel: OverviewChartPanel) {
    const compact = this.density() === 'compact';
    const inlineCompactDonut = compact && this.inline() && panel.chartType === 'donut';
    const analytics = this.mode() === 'analytics';
    const chartHeight = compact
      ? panel.chartType === 'donut'
        ? 190
        : 220
      : analytics
        ? panel.span === 'full'
          ? 280
          : panel.chartType === 'donut'
            ? 190
            : 260
        : 260;

    switch (panel.chartType) {
      case 'area':
        return {
          series: panel.series as ApexAxisChartSeries,
          chart: { ...mmBaseChart('area', chartHeight), stacked: false },
          xaxis: mmBaseXAxis(panel.categories),
          yaxis: mmBaseYAxis(),
          stroke: { ...mmBaseStroke('smooth'), width: analytics ? 2.5 : 2 },
          grid: mmBaseGrid(),
          legend: mmBaseLegend(),
          tooltip: mmBaseTooltip(),
          fill: {
            type: 'gradient',
            gradient: { opacityFrom: analytics ? 0.4 : 0.35, opacityTo: 0.05 },
          },
          colors: MM_CHART_PALETTE,
        };
      case 'line':
        return {
          series: panel.series as ApexAxisChartSeries,
          chart: { ...mmBaseChart('line', chartHeight), stacked: false },
          xaxis: mmBaseXAxis(panel.categories),
          yaxis: {
            ...mmBaseYAxis(),
            min: panel.id === 'delivery-sla' ? 88 : undefined,
            max: panel.id === 'delivery-sla' ? 100 : undefined,
            labels: {
              ...mmBaseYAxis().labels,
              formatter: panel.id === 'delivery-sla' || panel.id === 'customer-retention'
                ? (v: number) => `${v}%`
                : undefined,
            },
          },
          stroke: { ...mmBaseStroke('smooth'), width: 3 },
          grid: mmBaseGrid(),
          legend: mmBaseLegend(),
          tooltip: mmBaseTooltip(),
          markers: { size: analytics ? 4 : 0, strokeWidth: 0, hover: { size: 6 } },
          colors: MM_CHART_PALETTE,
        };
      case 'stackedBar':
        return {
          series: panel.series as ApexAxisChartSeries,
          chart: { ...mmBaseChart('bar', chartHeight), stacked: true },
          xaxis: mmBaseXAxis(panel.categories),
          yaxis: mmBaseYAxis(),
          grid: mmBaseGrid(),
          legend: mmBaseLegend(),
          tooltip: mmBaseTooltip(),
          plotOptions: { bar: { borderRadius: 6, columnWidth: analytics ? '50%' : '55%' } },
          dataLabels: analytics
            ? { enabled: false }
            : undefined,
          colors: MM_CHART_PALETTE,
        };
      case 'bar':
        return {
          series: panel.series as ApexAxisChartSeries,
          chart: { ...mmBaseChart('bar', chartHeight), stacked: false },
          xaxis: mmBaseXAxis(panel.categories),
          yaxis: mmBaseYAxis(),
          grid: mmBaseGrid(),
          legend: (panel.series as ApexAxisChartSeries).length > 1 ? mmBaseLegend() : { show: false },
          tooltip: mmBaseTooltip(),
          plotOptions: {
            bar: {
              borderRadius: 6,
              columnWidth: analytics ? '48%' : '55%',
              distributed: (panel.series as ApexAxisChartSeries).length === 1,
            },
          },
          dataLabels: analytics
            ? {
                enabled: true,
                style: { fontFamily: 'Cairo, sans-serif', fontSize: '11px', fontWeight: 700 },
                offsetY: -18,
              }
            : undefined,
          colors: MM_CHART_PALETTE,
        };
      case 'donut':
        return {
          series: panel.series as ApexNonAxisChartSeries,
          chart: {
            ...mmBaseChart('donut', chartHeight),
            height: inlineCompactDonut ? '100%' : chartHeight,
          },
          labels: panel.labels ?? [],
          legend: {
            ...mmBaseLegend(),
            position: inlineCompactDonut ? ('right' as const) : compact ? ('right' as const) : ('bottom' as const),
            horizontalAlign: inlineCompactDonut ? ('left' as const) : compact ? ('left' as const) : ('center' as const),
            fontSize: inlineCompactDonut ? '10px' : compact ? '11px' : '12px',
            itemMargin: inlineCompactDonut
              ? { horizontal: 6, vertical: 2 }
              : { horizontal: 10, vertical: 2 },
          },
          tooltip: mmBaseTooltip(),
          plotOptions: {
            pie: {
              donut: {
                size: inlineCompactDonut ? '62%' : compact ? '68%' : analytics ? '58%' : '62%',
                labels: {
                  show: true,
                  total: {
                    show: true,
                    label: this.locale.isRtl() ? 'الإجمالي' : 'Total',
                    fontFamily: 'Cairo, sans-serif',
                    fontWeight: 700,
                    fontSize: inlineCompactDonut ? '10px' : '12px',
                  },
                  value: {
                    fontWeight: 800,
                    fontSize: inlineCompactDonut ? '16px' : '18px',
                  },
                },
              },
            },
          },
          colors: MM_CHART_PALETTE,
        };
      case 'horizontalBar':
        return {
          series: panel.series as ApexAxisChartSeries,
          chart: { ...mmBaseChart('bar', chartHeight) },
          xaxis: mmBaseXAxis(panel.categories),
          yaxis: mmBaseYAxis(),
          grid: mmBaseGrid(),
          legend: { show: false },
          tooltip: mmBaseTooltip(),
          plotOptions: {
            bar: {
              horizontal: true,
              borderRadius: 6,
              barHeight: analytics ? '58%' : '62%',
              distributed: true,
            },
          },
          dataLabels: analytics
            ? {
                enabled: true,
                style: { fontFamily: 'Cairo, sans-serif', fontSize: '11px', fontWeight: 700 },
              }
            : undefined,
          colors: MM_CHART_PALETTE,
        };
      default:
        return {
          series: panel.series,
          chart: mmBaseChart('line', chartHeight),
          colors: MM_CHART_PALETTE,
        };
    }
  }
}
