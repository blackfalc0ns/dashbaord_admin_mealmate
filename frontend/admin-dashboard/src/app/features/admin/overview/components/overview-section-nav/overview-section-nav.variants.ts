import { cva } from 'class-variance-authority';

import { mergeClasses } from '../../../../../shared/utils/merge-classes';

const embeddedShell = mergeClasses(
  'grid w-full grid-cols-2 gap-1 rounded-[0.6875rem] border border-slate-200 bg-[#eef2f6] p-[3px]',
  'shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] sm:grid-cols-4 xl:grid-cols-8',
);

const embeddedItemBase = mergeClasses(
  'flex w-full min-h-8 min-w-0 shrink items-center justify-center gap-1.5 rounded-lg',
  'border border-transparent px-2 py-1.5 text-[0.6875rem] font-bold leading-snug text-slate-500',
  'whitespace-nowrap',
);

export const overviewSectionNavVariants = cva('w-full', {
  variants: {
    embedded: {
      true: embeddedShell,
      false: mergeClasses(
        'flex gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1',
        'shadow-sm [scrollbar-width:thin]',
      ),
    },
  },
  defaultVariants: {
    embedded: false,
  },
});

export const overviewSectionNavItemVariants = cva(
  mergeClasses(
    'inline-flex items-center font-bold transition-[color,background,box-shadow,border-color]',
    'duration-150',
  ),
  {
    variants: {
      embedded: {
        true: embeddedItemBase,
        false: mergeClasses(
          'shrink-0 gap-1.5 rounded-lg px-3 py-1.5 text-xs text-slate-500 whitespace-nowrap',
        ),
      },
      active: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        embedded: true,
        active: false,
        class: 'hover:bg-white/55 hover:text-slate-700',
      },
      {
        embedded: true,
        active: true,
        class: mergeClasses(
          'border-emerald-200/70 bg-white text-emerald-700',
          'shadow-[0_1px_2px_rgba(15,29,50,0.05),inset_0_0_0_1px_rgba(255,255,255,0.85)]',
        ),
      },
      {
        embedded: false,
        active: false,
        class: 'hover:bg-slate-50 hover:text-slate-900',
      },
      {
        embedded: false,
        active: true,
        class: 'bg-emerald-50 text-emerald-600 shadow-[inset_0_0_0_1px_#a7f3d0]',
      },
    ],
    defaultVariants: {
      embedded: false,
      active: false,
    },
  },
);

export const overviewSectionNavIconVariants = cva(
  'inline-flex shrink-0 items-center justify-center [&_ng-icon]:block',
  {
    variants: {
      embedded: {
        true: 'size-3.5',
        false: '',
      },
      active: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        embedded: true,
        active: false,
        class: 'text-slate-400',
      },
      {
        embedded: true,
        active: true,
        class: 'text-emerald-600',
      },
    ],
    defaultVariants: {
      embedded: false,
      active: false,
    },
  },
);

export const overviewSectionNavLabelVariants = cva('min-w-0 truncate', {
  variants: {
    embedded: {
      true: '',
      false: '',
    },
  },
  defaultVariants: {
    embedded: false,
  },
});

export const overviewSectionNavBadgeVariants = cva(
  mergeClasses(
    'inline-flex shrink-0 items-center justify-center rounded-full font-extrabold',
    'leading-none tabular-nums',
  ),
  {
    variants: {
      embedded: {
        true: 'min-w-4 h-4 px-1 text-[0.5625rem] border border-red-200 bg-red-50 text-red-600',
        false: 'min-w-4 h-4 px-1 bg-red-500 text-[0.5625rem] text-white',
      },
      active: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        embedded: true,
        active: true,
        class: 'border-red-100 bg-red-50',
      },
    ],
    defaultVariants: {
      embedded: false,
      active: false,
    },
  },
);
