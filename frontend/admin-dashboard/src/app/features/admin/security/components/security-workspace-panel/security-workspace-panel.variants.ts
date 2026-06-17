import { cva } from 'class-variance-authority';

import { mergeClasses } from '../../../../../shared/utils/merge-classes';

export const securityWorkspaceShellVariants = cva('flex flex-col gap-3');

export const securityWorkspaceToolbarVariants = cva(
  mergeClasses(
    'rounded-2xl border border-slate-200 bg-white p-3',
    'shadow-[0_10px_28px_-24px_rgba(15,23,42,0.35)]',
  ),
);

export const securityWorkspaceToolbarGridVariants = cva(
  'grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start',
);

export const securityWorkspaceEyebrowVariants = cva(
  mergeClasses(
    'inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50',
    'px-2.5 py-1 text-[0.68rem] font-extrabold text-emerald-800',
  ),
);

export const securityWorkspaceTitleVariants = cva('mt-2 text-lg font-black text-slate-900 sm:text-xl');

export const securityWorkspaceGoalVariants = cva('mt-1 max-w-3xl text-sm leading-7 text-slate-600');

export const securityWorkspaceChipRowVariants = cva('mt-2 flex flex-wrap gap-1.5');

export const securityWorkspaceChipVariants = cva(
  mergeClasses(
    'inline-flex items-center rounded-lg border px-2.5 py-1.5 text-[0.68rem] font-bold',
  ),
  {
    variants: {
      tone: {
        role: 'border-violet-200 bg-violet-50 text-violet-800',
        scope: 'border-slate-200 bg-slate-50 text-slate-600',
      },
    },
    defaultVariants: {
      tone: 'scope',
    },
  },
);

export const securityWorkspaceActionsVariants = cva('flex flex-col gap-2 sm:min-w-56');

export const securityWorkspacePrimaryActionVariants = cva(
  mergeClasses(
    'min-h-10 rounded-xl bg-emerald-600 px-4 text-sm font-extrabold text-white',
    'shadow-[0_12px_22px_-16px_rgba(5,150,105,0.9)] hover:bg-emerald-500',
  ),
);

export const securityWorkspaceSecondaryActionsVariants = cva('grid grid-cols-3 gap-1.5');

export const securityWorkspaceSecondaryActionVariants = cva(
  mergeClasses(
    'min-h-9 rounded-xl border border-slate-200 bg-white px-1.5 text-[0.68rem] font-bold text-slate-700',
    'hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800',
  ),
);

export const securityWorkspaceStatsGridVariants = cva('grid gap-2 sm:grid-cols-3');

export const securityWorkspaceStatCardVariants = cva(
  mergeClasses(
    'rounded-2xl border border-y-slate-200 border-e-slate-200 bg-white p-3',
    'shadow-[0_10px_28px_-24px_rgba(15,23,42,0.35)]',
  ),
);

export const securityWorkspaceFilterBarVariants = cva(
  mergeClasses(
    'rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/80 p-3',
    'shadow-[0_10px_28px_-24px_rgba(15,23,42,0.2)]',
  ),
);

export const securityWorkspaceSearchVariants = cva(
  mergeClasses(
    'flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3',
    'text-xs font-bold text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]',
  ),
);

export const securityWorkspaceLeadPillVariants = cva(
  mergeClasses(
    'inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-extrabold',
  ),
);

export const securityWorkspaceTableShellVariants = cva(
  mergeClasses(
    'overflow-hidden rounded-2xl border border-slate-200 bg-white py-4',
    'shadow-[0_10px_28px_-24px_rgba(15,23,42,0.35)]',
  ),
);

export const securityWorkspaceTableWrapVariants = cva(
  'overflow-x-auto rounded-xl border border-slate-200',
);

export const securityWorkspaceTableHeadCellVariants = cva(
  mergeClasses(
    'sticky top-0 z-[1] border-b border-slate-200 bg-slate-50/95 px-3 py-2.5',
    'text-start text-[0.7rem] font-black uppercase tracking-wide text-slate-500 backdrop-blur-sm',
  ),
);

export const securityWorkspaceTableRowVariants = cva(
  mergeClasses(
    'border-s-4 transition hover:bg-emerald-50/60',
  ),
);

export const securityWorkspaceTableCellVariants = cva(
  'border-b border-slate-100 px-3 py-3 align-middle text-xs font-bold text-slate-700',
);

export const securityWorkspaceStatusPillVariants = cva(
  mergeClasses(
    'inline-flex max-w-full truncate rounded-full border px-2.5 py-1 text-[0.625rem] font-extrabold',
  ),
);

export const securityWorkspaceInsightGridVariants = cva('grid gap-2 lg:grid-cols-2');

export const securityWorkspaceInsightCardVariants = cva(
  mergeClasses(
    'rounded-2xl border border-y-slate-200 border-e-slate-200 bg-slate-50/80 p-3',
  ),
);
