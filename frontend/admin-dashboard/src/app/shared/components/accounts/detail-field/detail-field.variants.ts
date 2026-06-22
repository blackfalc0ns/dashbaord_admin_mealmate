import { cva } from 'class-variance-authority';

export const detailFieldVariants = cva('flex items-start gap-3');

export const detailFieldIconVariants = cva(
  'flex size-9 shrink-0 items-center justify-center rounded-xl ring-1 ring-slate-100',
  {
    variants: {
      tone: {
        default: 'bg-slate-50 text-slate-500',
        success: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
        warning: 'bg-amber-50 text-amber-600 ring-amber-100',
      },
    },
    defaultVariants: {
      tone: 'default',
    },
  },
);

export const detailFieldLabelVariants = cva(
  'text-[10px] font-bold uppercase tracking-wider text-slate-400',
);

export const detailFieldValueVariants = cva('text-sm font-bold text-slate-800');
