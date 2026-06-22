import { cva } from 'class-variance-authority';

export const detailTabNavVariants = cva(
  'flex flex-wrap gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm',
);

export const detailTabButtonVariants = cva(
  'flex min-w-[120px] flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all',
  {
    variants: {
      active: {
        true: 'bg-emerald-600 text-white',
        false: 'text-slate-500 hover:bg-slate-50',
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);
