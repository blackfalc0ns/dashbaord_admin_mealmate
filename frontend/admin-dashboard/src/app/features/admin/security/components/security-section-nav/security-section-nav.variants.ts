import { cva } from 'class-variance-authority';

import { mergeClasses } from '../../../../../shared/utils/merge-classes';

export const securitySectionNavVariants = cva(
  mergeClasses(
    'inline-flex w-fit max-w-full flex-wrap gap-1 rounded-[0.6875rem] border border-slate-200 bg-[#eef2f6] p-[3px]',
    'shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]',
  ),
);

export const securitySectionNavItemVariants = cva(
  mergeClasses(
    'inline-flex min-h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg',
    'border border-transparent px-3 py-2 text-[0.6875rem] font-bold leading-none text-slate-500',
    'transition-[color,background,box-shadow,border-color] duration-150 whitespace-nowrap',
  ),
  {
    variants: {
      active: {
        true: mergeClasses(
          'border-emerald-200/70 bg-white text-emerald-700',
          'shadow-[0_1px_2px_rgba(15,29,50,0.05),inset_0_0_0_1px_rgba(255,255,255,0.85)]',
        ),
        false: 'hover:bg-white/55 hover:text-slate-700',
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

export const securitySectionNavItemHeadVariants = cva(
  'inline-flex min-w-0 items-center justify-center gap-1.5 whitespace-nowrap',
);

export const securitySectionNavIconVariants = cva(
  'inline-flex shrink-0 items-center justify-center [&_ng-icon]:block',
  {
    variants: {
      active: {
        true: 'text-emerald-600',
        false: 'text-slate-400',
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

export const securitySectionNavLabelVariants = cva(
  'truncate text-[0.6875rem] font-extrabold leading-none',
);

export const securitySubNavVariants = cva(
  mergeClasses(
    'inline-flex w-fit max-w-full flex-wrap gap-1 rounded-xl border border-slate-200 bg-white p-1',
    'shadow-[0_8px_24px_-22px_rgba(15,23,42,0.35)]',
  ),
);

export const securitySubNavItemVariants = cva(
  mergeClasses(
    'inline-flex min-h-8 shrink-0 items-center justify-center rounded-lg px-3 py-1.5',
    'text-[0.6875rem] font-bold text-slate-500 transition-[color,background] duration-150 whitespace-nowrap',
  ),
  {
    variants: {
      active: {
        true: mergeClasses(
          'bg-gradient-to-b from-emerald-600 to-emerald-700 text-white',
          'shadow-[0_8px_18px_-14px_rgba(5,150,105,0.85)]',
        ),
        false: 'hover:bg-emerald-50 hover:text-emerald-700',
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

export const securitySubNavLabelVariants = cva('truncate text-[0.6875rem] font-extrabold leading-none');

export const securityNavBadgeVariants = cva(
  mergeClasses(
    'inline-flex min-w-4 h-4 shrink-0 items-center justify-center rounded-full px-1',
    'text-[0.5625rem] font-extrabold leading-none tabular-nums',
  ),
  {
    variants: {
      active: {
        true: 'border border-emerald-200 bg-emerald-100 text-emerald-700',
        false: 'border border-red-200 bg-red-50 text-red-600',
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);
