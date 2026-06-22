import { cva } from 'class-variance-authority';

export const detailDocItemVariants = cva(
  'flex cursor-pointer flex-col gap-2 rounded-xl border p-3 transition-all hover:bg-slate-50',
  {
    variants: {
      selected: {
        true: 'border-emerald-500 bg-emerald-50/10',
        false: 'border-slate-100',
      },
    },
    defaultVariants: {
      selected: false,
    },
  },
);

export const detailDocStatusVariants = cva(
  'inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold ring-1',
  {
    variants: {
      status: {
        verified: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
        under_review: 'bg-amber-50 text-amber-700 ring-amber-600/20',
        missing: 'bg-red-50 text-red-700 ring-red-600/20',
        expired: 'bg-red-50 text-red-700 ring-red-600/20',
      },
    },
    defaultVariants: {
      status: 'under_review',
    },
  },
);
