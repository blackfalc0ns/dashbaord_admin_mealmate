import { cva } from 'class-variance-authority';

export const detailStatCardVariants = cva(
  'flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5',
);

export const detailStatIconVariants = cva('flex size-10 items-center justify-center rounded-xl', {
  variants: {
    tone: {
      emerald: 'bg-emerald-50 text-emerald-600',
      blue: 'bg-blue-50 text-blue-600',
      amber: 'bg-amber-50 text-amber-600',
      purple: 'bg-purple-50 text-purple-600',
    },
  },
  defaultVariants: {
    tone: 'emerald',
  },
});
