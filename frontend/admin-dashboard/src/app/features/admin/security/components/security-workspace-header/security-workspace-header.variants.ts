import { cva } from 'class-variance-authority';

import { mergeClasses } from '../../../../../shared/utils/merge-classes';

export const securityCommandBarVariants = cva(
  mergeClasses(
    'relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-4',
    'shadow-[0_12px_30px_-24px_rgba(15,23,42,0.15)]',
  ),
);

export const securityCommandBarAccentVariants = cva(
  'pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-l from-emerald-600 via-emerald-400 to-emerald-500 opacity-90',
);

export const securityCommandBarHeroVariants = cva('relative z-[1] pt-0.5');

export const securityCommandBarMetaRowVariants = cva(
  mergeClasses(
    'relative z-[1] mt-2.5 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-2.5',
  ),
);

export const securityCommandBarUtilityRowVariants = cva(
  mergeClasses(
    'relative z-[1] mt-2.5 grid gap-2 border-t border-slate-100 pt-2.5',
    'lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start',
  ),
);

export const securityCommandBarSearchVariants = cva(
  mergeClasses(
    'flex min-h-10 min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3',
    'text-xs font-bold text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]',
  ),
);

export const securityCommandBarSecondaryActionsVariants = cva('flex flex-wrap gap-1.5 lg:justify-end');

export const securityCommandBarSecondaryActionVariants = cva(
  mergeClasses(
    'inline-flex min-h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-3',
    'text-[0.6875rem] font-bold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800',
  ),
);

export const securityCommandBarLeadRowVariants = cva(
  'relative z-[1] mt-2 flex flex-wrap items-center gap-1.5',
);

export const securityCommandBarFilterRowVariants = cva(
  'relative z-[1] mt-2 flex flex-wrap items-center gap-1.5',
);

export const securityCommandBarRowLabelVariants = cva(
  'text-[0.625rem] font-extrabold uppercase tracking-wide text-slate-400 leading-tight',
);

export const securityCommandBarChipVariants = cva(
  mergeClasses(
    'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1',
    'text-[0.6875rem] font-bold leading-tight whitespace-nowrap',
  ),
  {
    variants: {
      tone: {
        live: 'border-emerald-100 bg-emerald-50/60 text-emerald-800',
        muted: 'border-slate-100 bg-slate-50/60 text-slate-600',
        warn: 'border-amber-100 bg-amber-50/60 text-amber-800',
        role: 'border-violet-100 bg-violet-50/60 text-violet-800',
        scope: 'border-sky-100 bg-sky-50/60 text-sky-800',
        eyebrow: 'border-slate-100 bg-white text-slate-700',
      },
    },
    defaultVariants: {
      tone: 'muted',
    },
  },
);

export const securityCommandBarChipMarkVariants = cva(
  'size-[0.4375rem] shrink-0 rounded-full bg-emerald-500 shadow-[0_0_0_2px_rgba(16,185,129,0.18)]',
);

export const securityCommandBarLeadPillVariants = cva(
  mergeClasses(
    'inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-[0.6875rem] font-extrabold',
  ),
);

export const securityCommandBarFilterPillVariants = cva(
  mergeClasses(
    'inline-flex items-center rounded-full border px-2.5 py-1 text-[0.625rem] font-extrabold',
  ),
);

export const securityCommandBarActionVariants = cva(
  mergeClasses(
    'inline-flex min-h-9 items-center gap-2 rounded-[0.625rem] border-0 px-3.5',
    'bg-emerald-600 text-xs font-extrabold text-white no-underline',
    'shadow-[0_1px_3px_rgba(5,150,105,0.18)] transition hover:bg-emerald-500',
  ),
);

export const securityCommandBarActionIconVariants = cva(
  mergeClasses(
    'inline-flex size-[1.125rem] items-center justify-center rounded-full',
    'bg-white/20 text-sm leading-none',
  ),
);

export const securityCommandBarNavSectionVariants = cva(
  'relative z-[1] mt-3 flex w-full flex-col gap-1.5 border-t border-slate-100 pt-3',
);
