import { cva } from 'class-variance-authority';

export const detailPanelCardVariants = cva(
  'rounded-2xl border border-slate-100 bg-white p-5 shadow-sm',
);

export const detailPanelHeaderVariants = cva(
  'mb-4 flex items-center gap-2 border-b border-slate-50 pb-2.5 text-sm font-extrabold text-slate-900',
);

export const detailPanelSubtitleVariants = cva(
  'mt-1 text-[10px] font-bold text-slate-400',
);
