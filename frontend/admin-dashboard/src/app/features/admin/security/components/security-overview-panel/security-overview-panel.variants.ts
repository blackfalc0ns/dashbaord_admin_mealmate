import { cva } from 'class-variance-authority';

import { mergeClasses } from '../../../../../shared/utils/merge-classes';

export const securityOverviewShellVariants = cva('flex flex-col gap-4');

export const securityOverviewHeroVariants = cva(
  mergeClasses(
    'relative overflow-hidden rounded-2xl border border-slate-800/10',
    'bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-4 text-white sm:p-5',
    'shadow-[0_24px_48px_-32px_rgba(15,23,42,0.85)]',
  ),
);

export const securityOverviewHeroGlowVariants = cva(
  'pointer-events-none absolute -end-8 -top-10 size-44 rounded-full bg-emerald-400/20 blur-3xl',
);

export const securityOverviewHeroGlowSecondaryVariants = cva(
  'pointer-events-none absolute -bottom-14 start-6 size-36 rounded-full bg-sky-400/10 blur-3xl',
);

export const securityOverviewHeroGridVariants = cva(
  'relative z-[1] grid gap-4 lg:grid-cols-[minmax(0,1fr)_11.5rem] lg:items-center',
);

export const securityOverviewHeroBadgeVariants = cva(
  mergeClasses(
    'inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10',
    'px-2.5 py-1 text-[0.625rem] font-extrabold uppercase tracking-wide text-emerald-100',
  ),
);

export const securityOverviewHeroTitleVariants = cva(
  'mt-3 text-xl font-black leading-tight sm:text-2xl',
);

export const securityOverviewHeroTextVariants = cva(
  'mt-2 max-w-2xl text-sm leading-7 text-slate-300',
);

export const securityOverviewHeroActionsVariants = cva('mt-4 flex flex-wrap gap-2');

export const securityOverviewHeroActionPrimaryVariants = cva(
  mergeClasses(
    'inline-flex min-h-9 items-center gap-2 rounded-xl bg-emerald-500 px-3.5',
    'text-xs font-extrabold text-white shadow-sm shadow-emerald-900/30 transition hover:bg-emerald-400 active:scale-[0.98]',
  ),
);

export const securityOverviewHeroActionSecondaryVariants = cva(
  mergeClasses(
    'inline-flex min-h-9 items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3.5',
    'text-xs font-extrabold text-white transition hover:bg-white/10 active:scale-[0.98]',
  ),
);

export const securityOverviewScoreCardVariants = cva(
  mergeClasses(
    'relative flex flex-col items-center justify-center rounded-2xl border border-white/10',
    'bg-white/5 px-3 py-4 text-center backdrop-blur-sm',
  ),
);

export const securityOverviewScoreRingVariants = cva(
  mergeClasses(
    'relative flex size-[5.5rem] items-center justify-center rounded-full',
    'bg-[conic-gradient(from_210deg,#34d399_0deg,#34d399_328deg,rgba(255,255,255,0.12)_328deg)]',
    'shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]',
  ),
);

export const securityOverviewScoreInnerVariants = cva(
  'flex size-[4.25rem] flex-col items-center justify-center rounded-full bg-slate-950/90',
);

export const securityOverviewKpiGridVariants = cva('grid gap-3 sm:grid-cols-3');

export const securityOverviewKpiCardVariants = cva(
  mergeClasses(
    'group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-4',
    'border-s-4 shadow-[0_10px_28px_-24px_rgba(15,23,42,0.35)] transition duration-200',
    'hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_16px_32px_-24px_rgba(15,23,42,0.4)]',
  ),
  {
    variants: {
      tone: {
        berry: 'border-s-emerald-600',
        green: 'border-s-emerald-500',
        warm: 'border-s-amber-400',
        red: 'border-s-rose-500',
        blue: 'border-s-sky-500',
        slate: 'border-s-slate-400',
      },
    },
    defaultVariants: {
      tone: 'green',
    },
  },
);

export const securityOverviewKpiIconVariants = cva(
  mergeClasses(
    'inline-flex size-9 items-center justify-center rounded-xl ring-1',
  ),
  {
    variants: {
      tone: {
        berry: 'bg-emerald-50 text-emerald-700 ring-emerald-100/80',
        green: 'bg-emerald-50 text-emerald-700 ring-emerald-100/80',
        warm: 'bg-amber-50 text-amber-700 ring-amber-100/80',
        red: 'bg-rose-50 text-rose-600 ring-rose-100/80',
        blue: 'bg-sky-50 text-sky-600 ring-sky-100/80',
        slate: 'bg-slate-50 text-slate-600 ring-slate-100/80',
      },
    },
    defaultVariants: {
      tone: 'green',
    },
  },
);

export const securityOverviewKpiLiveVariants = cva(
  'rounded-full px-2 py-0.5 text-[0.625rem] font-extrabold',
  {
    variants: {
      tone: {
        berry: 'bg-emerald-50 text-emerald-700',
        green: 'bg-emerald-50 text-emerald-700',
        warm: 'bg-amber-50 text-amber-700',
        red: 'bg-rose-50 text-rose-700',
        blue: 'bg-sky-50 text-sky-700',
        slate: 'bg-slate-100 text-slate-600',
      },
    },
    defaultVariants: {
      tone: 'green',
    },
  },
);

export const securityOverviewJumpGridVariants = cva('grid gap-3 md:grid-cols-2');

export const securityOverviewJumpCardVariants = cva(
  mergeClasses(
    'group relative flex min-h-[11.5rem] flex-col justify-between overflow-hidden rounded-2xl border',
    'p-4 text-start shadow-[0_10px_28px_-24px_rgba(15,23,42,0.35)]',
    'transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-28px_rgba(15,23,42,0.45)]',
  ),
  {
    variants: {
      tone: {
        access: 'border-emerald-200/80 bg-gradient-to-br from-white via-white to-emerald-50/40 hover:border-emerald-300',
        users: 'border-sky-200/80 bg-gradient-to-br from-white via-white to-sky-50/40 hover:border-sky-300',
      },
    },
    defaultVariants: {
      tone: 'access',
    },
  },
);

export const securityOverviewJumpCardGlowVariants = cva(
  mergeClasses(
    'pointer-events-none absolute -end-6 -top-8 size-32 rounded-full opacity-60 blur-2xl transition',
    'group-hover:opacity-100',
  ),
  {
    variants: {
      tone: {
        access: 'bg-emerald-300/35',
        users: 'bg-sky-300/30',
      },
    },
    defaultVariants: {
      tone: 'access',
    },
  },
);

export const securityOverviewJumpIconVariants = cva(
  'mb-3 inline-flex size-11 items-center justify-center rounded-xl ring-1',
  {
    variants: {
      tone: {
        access: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
        users: 'bg-sky-50 text-sky-700 ring-sky-100',
      },
    },
    defaultVariants: {
      tone: 'access',
    },
  },
);

export const securityOverviewJumpStatVariants = cva(
  'rounded-full px-2.5 py-1 text-[0.68rem] font-extrabold',
  {
    variants: {
      tone: {
        access: 'bg-emerald-50 text-emerald-800',
        users: 'bg-sky-50 text-sky-800',
      },
    },
    defaultVariants: {
      tone: 'access',
    },
  },
);

export const securityOverviewBottomGridVariants = cva('grid gap-3');

export const securityOverviewPrincipleGridVariants = cva('grid gap-2 md:grid-cols-3');

export const securityOverviewPrincipleCardVariants = cva(
  mergeClasses(
    'relative flex items-start gap-3 overflow-hidden rounded-xl border border-slate-200/90 bg-white p-3.5 text-start',
    'shadow-[0_8px_24px_-20px_rgba(15,23,42,0.25)] transition hover:border-slate-300',
  ),
);

export const securityOverviewPrincipleIconVariants = cva(
  'inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white',
);

export const securityOverviewPrincipleBodyVariants = cva('min-w-0 flex-1');

export const securityOverviewPrinciplesShellVariants = cva(
  mergeClasses(
    'rounded-2xl border border-slate-200/90 bg-gradient-to-b from-slate-50/80 to-white p-4',
    'shadow-[0_10px_28px_-24px_rgba(15,23,42,0.25)]',
  ),
);

export const securityOverviewActivityCardVariants = cva(
  mergeClasses(
    'rounded-2xl border border-slate-200/90 bg-white p-4',
    'shadow-[0_10px_28px_-24px_rgba(15,23,42,0.35)]',
  ),
);

export const securityOverviewActivityHeaderVariants = cva(
  'mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3',
);

export const securityOverviewActivityTableVariants = cva(
  'overflow-hidden rounded-xl border border-slate-150',
);

export const securityOverviewActivityHeadVariants = cva(
  'grid grid-cols-[minmax(0,1fr)_auto] gap-2 border-b border-slate-100 bg-slate-50/80 px-3 py-2 text-[0.625rem] font-extrabold uppercase tracking-wider text-slate-400 sm:grid-cols-[minmax(0,1fr)_6rem_5.5rem]',
);

export const securityOverviewActivityRowVariants = cva(
  mergeClasses(
    'group grid w-full grid-cols-[minmax(0,1fr)_auto] gap-2 border-b border-slate-100 px-3 py-2.5 text-start',
    'transition last:border-b-0 hover:bg-slate-50/80',
    'sm:grid-cols-[minmax(0,1fr)_6rem_5.5rem] sm:items-center',
  ),
);

export const securityOverviewActivityTypeBadgeVariants = cva(
  'inline-flex rounded-md px-2 py-0.5 text-[0.625rem] font-extrabold',
  {
    variants: {
      tone: {
        berry: 'bg-emerald-50 text-emerald-700',
        green: 'bg-emerald-50 text-emerald-700',
        warm: 'bg-amber-50 text-amber-700',
        red: 'bg-rose-50 text-rose-700',
        blue: 'bg-sky-50 text-sky-700',
        slate: 'bg-slate-100 text-slate-600',
      },
    },
    defaultVariants: {
      tone: 'slate',
    },
  },
);

export const securityOverviewActivityStatusVariants = cva(
  'hidden truncate text-[0.68rem] font-bold text-slate-600 sm:block',
);

export const securityOverviewActivityTimeVariants = cva(
  'text-[0.68rem] font-bold text-slate-400 sm:text-end',
);

export const securityOverviewViewAllVariants = cva(
  mergeClasses(
    'inline-flex min-h-8 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3',
    'text-[0.68rem] font-extrabold text-emerald-700 transition hover:border-emerald-200 hover:bg-emerald-50',
  ),
);

export type SecurityOverviewJumpTone = 'access' | 'users';
export type SecurityOverviewKpiTone = 'berry' | 'green' | 'warm' | 'red' | 'blue' | 'slate';
