import { cva } from 'class-variance-authority';

export const pageHeadingRowVariants = cva('flex flex-wrap items-end justify-between gap-3');

export const pageHeadingTitleVariants = cva(
  'text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl',
);

export const pageHeadingDescriptionVariants = cva(
  'mt-1 max-w-3xl text-sm leading-relaxed text-slate-500',
);

export const pageHeadingActionVariants = cva(
  'inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-2 text-sm font-bold text-white shadow-[0_2px_8px_-4px_rgba(5,150,105,0.35)] transition-all hover:from-emerald-500 hover:to-emerald-600 hover:shadow-[0_4px_12px_-4px_rgba(5,150,105,0.4)]',
);
