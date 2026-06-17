import { cva } from 'class-variance-authority';

export const breadcrumbNavVariants = cva(
  'mb-3 flex flex-wrap items-center gap-1.5 text-xs text-slate-500',
);

export const breadcrumbHomeButtonVariants = cva(
  'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-medium text-emerald-700 transition-colors hover:bg-emerald-50',
);

export const breadcrumbItemVariants = cva('rounded-md px-1.5 py-0.5 font-medium', {
  variants: {
    active: {
      true: 'bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-800',
      false: 'text-slate-600',
    },
  },
  defaultVariants: {
    active: false,
  },
});

export const breadcrumbSeparatorVariants = cva('size-3.5 shrink-0 text-slate-300 rtl:rotate-180');
