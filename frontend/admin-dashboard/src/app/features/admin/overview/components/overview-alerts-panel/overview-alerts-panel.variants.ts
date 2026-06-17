import { cva } from 'class-variance-authority';

import { mergeClasses } from '../../../../../shared/utils/merge-classes';

export const overviewActivityListVariants = cva(
  'm-0 flex list-none flex-col p-0',
  {
    variants: {
      compact: {
        true: 'gap-1.5',
        false: 'gap-2',
      },
    },
    defaultVariants: {
      compact: false,
    },
  },
);

export const overviewActivityLinkVariants = cva(
  mergeClasses(
    'group/activity relative flex min-w-0 items-start gap-2.5 rounded-xl border border-transparent',
    'no-underline transition-[background,border-color,box-shadow] duration-150',
    'hover:border-slate-200/90 hover:bg-slate-50/90 hover:shadow-sm',
  ),
  {
    variants: {
      compact: {
        true: 'gap-2 px-1 py-1.5',
        false: 'gap-2.5 px-1.5 py-2',
      },
    },
    defaultVariants: {
      compact: false,
    },
  },
);

export const overviewActivityIconVariants = cva(
  mergeClasses(
    'relative z-[1] inline-flex shrink-0 items-center justify-center rounded-lg ring-2 ring-white',
  ),
  {
    variants: {
      compact: {
        true: 'size-7',
        false: 'size-8',
      },
      tone: {
        accounts: 'bg-emerald-50 text-emerald-600 ring-emerald-100/80',
        operations: 'bg-amber-50 text-amber-600 ring-amber-100/80',
        finance: 'bg-sky-50 text-sky-600 ring-sky-100/80',
        support: 'bg-violet-50 text-violet-600 ring-violet-100/80',
        subscriptions: 'bg-teal-50 text-teal-600 ring-teal-100/80',
        default: 'bg-slate-100 text-slate-500 ring-slate-200/80',
      },
    },
    defaultVariants: {
      compact: false,
      tone: 'default',
    },
  },
);

export const overviewActivityRailVariants = cva(
  'absolute top-8 bottom-0 w-px bg-slate-200/90',
  {
    variants: {
      compact: {
        true: 'start-3.5 top-7',
        false: 'start-4 top-8',
      },
    },
    defaultVariants: {
      compact: false,
    },
  },
);

export const overviewActivityTextVariants = cva(
  'block min-w-0 leading-snug text-slate-700 group-hover/activity:text-slate-900',
  {
    variants: {
      compact: {
        true: 'text-[0.75rem] font-bold',
        false: 'text-[0.8125rem] font-bold',
      },
    },
    defaultVariants: {
      compact: false,
    },
  },
);

export const overviewActivityTimeVariants = cva(
  'inline-flex w-fit rounded-full bg-slate-100 px-2 py-0.5 text-[0.625rem] font-bold text-slate-500',
  {
    variants: {
      compact: {
        true: 'mt-0.5',
        false: 'mt-1',
      },
    },
    defaultVariants: {
      compact: false,
    },
  },
);

export const overviewActivityChevronVariants = cva(
  mergeClasses(
    'mt-1 hidden shrink-0 text-slate-300 transition-[color,opacity,transform] duration-150',
    'group-hover/activity:text-emerald-500 sm:inline-flex',
  ),
  {
    variants: {
      compact: {
        true: 'opacity-100 text-slate-300 group-hover/activity:text-emerald-500',
        false: '',
      },
    },
    defaultVariants: {
      compact: false,
    },
  },
);

export type OverviewActivityTone =
  | 'accounts'
  | 'operations'
  | 'finance'
  | 'support'
  | 'subscriptions'
  | 'default';
