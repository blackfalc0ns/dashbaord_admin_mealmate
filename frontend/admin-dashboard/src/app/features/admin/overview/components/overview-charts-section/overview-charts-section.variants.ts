import { cva } from 'class-variance-authority';

import { mergeClasses } from '../../../../../shared/utils/merge-classes';
import type { OverviewChartPanel } from '../../models/overview.model';

export const overviewChartDetailsLinkVariants = cva(
  mergeClasses(
    'group/details inline-flex w-full items-center justify-between gap-2 no-underline',
    'text-[0.6875rem] font-bold leading-none transition-[color,background,border-color,box-shadow]',
    'duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/25',
    'focus-visible:ring-offset-1',
  ),
  {
    variants: {
      analytics: {
        true: mergeClasses(
          'mt-1 border-t border-slate-100 pt-2.5 text-slate-600',
          'hover:text-emerald-700',
        ),
        false: mergeClasses(
          'mt-2 rounded-lg border border-slate-200/80 bg-slate-50/90 px-3 py-2 text-slate-600',
          'hover:border-emerald-200/80 hover:bg-emerald-50/80 hover:text-emerald-700 hover:shadow-sm',
        ),
      },
      merged: {
        true: mergeClasses(
          'mx-2.5 mb-1.5 w-[calc(100%-1.25rem)] rounded-md border border-slate-200/70 bg-white',
          'px-2.5 py-1.5 shadow-[0_1px_2px_rgba(15,29,50,0.04)]',
          'hover:border-emerald-200/70 hover:bg-emerald-50/40',
        ),
        false: '',
      },
    },
    defaultVariants: {
      analytics: false,
      merged: false,
    },
  },
);

export const overviewChartDetailsLinkIconVariants = cva(
  mergeClasses(
    'inline-flex shrink-0 items-center justify-center rounded-md bg-white text-emerald-600',
    'ring-1 ring-emerald-100/80 transition-[transform,background,color,ring-color] duration-150',
    'group-hover/details:translate-x-0.5 group-hover/details:bg-emerald-600 group-hover/details:text-white',
    'group-hover/details:ring-emerald-500/20 rtl:group-hover/details:-translate-x-0.5',
  ),
  {
    variants: {
      size: {
        default: 'size-5',
        compact: 'size-4',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

export const overviewChartCardVariants = cva('mm-overview-chart-card overflow-hidden', {
  variants: {
    compact: {
      true: '',
      false: '',
    },
    donut: {
      true: '',
      false: '',
    },
    inline: {
      true: 'flex h-full min-h-0 w-full flex-col',
      false: '',
    },
  },
  compoundVariants: [
    {
      compact: true,
      donut: true,
      inline: true,
      class: mergeClasses(
        '[&_[data-slot=card-content]]:flex [&_[data-slot=card-content]]:min-h-0',
        '[&_[data-slot=card-content]]:flex-1 [&_[data-slot=card-content]]:items-center',
        '[&_[data-slot=card-content]]:justify-center [&_[data-slot=card-content]]:py-0',
      ),
    },
  ],
  defaultVariants: {
    compact: false,
    donut: false,
    inline: false,
  },
});

export const overviewChartBodyVariants = cva(
  'mm-overview-chart-card__body flex min-h-0 w-full items-center justify-center',
  {
    variants: {
      compact: {
        true: 'py-0.5',
        false: 'block',
      },
      donut: {
        true: '',
        false: '',
      },
      inline: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        compact: true,
        donut: true,
        inline: true,
        class: mergeClasses(
          'h-full flex-1 py-0',
          '[&_apx-chart]:block [&_apx-chart]:h-full [&_apx-chart]:min-h-[8.5rem] [&_apx-chart]:w-full',
        ),
      },
      {
        compact: true,
        donut: true,
        inline: false,
        class: mergeClasses(
          'block',
          '[&_apx-chart]:block [&_apx-chart]:w-full [&_apx-chart]:max-h-[11.5rem]',
        ),
      },
    ],
    defaultVariants: {
      compact: false,
      donut: false,
      inline: false,
    },
  },
);

export const overviewChartsShellVariants = cva('mm-overview-charts', {
  variants: {
    compact: {
      true: 'mm-overview-charts--compact',
      false: '',
    },
    inline: {
      true: 'mm-overview-charts--inline flex h-full min-h-0 w-full flex-col',
      false: '',
    },
  },
  defaultVariants: {
    compact: false,
    inline: false,
  },
});

export const overviewChartsRowVariants = cva('mm-overview-charts__row mm-overview-charts__row--large', {
  variants: {
    grid: {
      true: mergeClasses(
        'mm-overview-charts__row--grid grid grid-cols-1 gap-2.5 md:grid-cols-2',
      ),
      false: '',
    },
    solo: {
      true: 'mm-overview-charts__row--solo',
      false: '',
    },
    inline: {
      true: 'flex h-full min-h-0 flex-1 flex-col',
      false: '',
    },
  },
  defaultVariants: {
    grid: false,
    solo: false,
    inline: false,
  },
});

export function mergeOverviewChartCardClasses(
  panel: OverviewChartPanel,
  compact: boolean,
  inline: boolean,
  layout: 'featured' | 'grid',
  chartCount: number,
): string {
  return mergeClasses(
    overviewChartCardVariants({
      compact,
      donut: panel.chartType === 'donut',
      inline,
    }),
    compact ? 'mm-overview-chart-card--compact' : '',
    panel.chartType === 'donut' ? 'mm-overview-chart-card--donut' : '',
    layout !== 'grid' || chartCount > 1 ? 'mm-overview-chart-card--wide' : '',
  );
}
