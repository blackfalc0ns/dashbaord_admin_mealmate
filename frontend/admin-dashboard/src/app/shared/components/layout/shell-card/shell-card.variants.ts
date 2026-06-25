import { cva } from 'class-variance-authority';

export const shellCardVariants = cva(
  'overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-[0_4px_14px_-10px_rgba(15,41,24,0.1)] lg:rounded-[1.35rem]',
);

export const shellCanvasVariants = cva('relative flex h-dvh min-h-0 bg-white p-2.5 sm:p-3 lg:p-4');

export const shellMainColumnVariants = cva(
  'relative z-10 flex h-full min-h-0 min-w-0 flex-1 flex-col gap-2.5 bg-white sm:gap-3 ms-2.5 lg:gap-4 lg:ms-4',
);
