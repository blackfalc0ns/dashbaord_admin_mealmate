import { cva } from 'class-variance-authority';

export const detailToastVariants = cva(
  'fixed bottom-5 start-5 z-50 flex items-center gap-2.5 rounded-xl border px-4 py-3 text-xs font-extrabold shadow-lg animate-in slide-in-from-bottom-5 duration-300',
  {
    variants: {
      type: {
        success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
        warning: 'border-amber-200 bg-amber-50 text-amber-800',
        info: 'border-blue-200 bg-blue-50 text-blue-800',
      },
    },
    defaultVariants: {
      type: 'success',
    },
  },
);
