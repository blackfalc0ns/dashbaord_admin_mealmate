import { cva } from 'class-variance-authority';

import { mergeClasses } from '@/shared/utils/merge-classes';

export const adminSidebarHostVariants = cva(
  'mm-admin-sidebar-host flex h-full min-h-0 shrink-0 flex-col overflow-hidden',
);

export const adminSidebarVariants = cva(
  'mm-admin-sidebar relative flex min-h-0 flex-1 flex-col h-full min-h-0 w-full overflow-hidden rounded-2xl border border-[#0f2918]/50 bg-[#0f2918] shadow-[0_6px_18px_-10px_rgba(0,0,0,0.22)] lg:rounded-[1.35rem]',
);

export const sidebarBrandPanelVariants = cva(
  'mm-sidebar-brand-panel rounded-xl border border-white/15 bg-gradient-to-br from-[#fafdfb] via-[#f0f6f2] to-[#dfe9e3] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] px-3 pb-3 pt-4',
  {
    variants: {
      collapsed: {
        true: 'mm-sidebar-brand-panel--collapsed px-2 py-3',
        false: '',
      },
    },
    defaultVariants: {
      collapsed: false,
    },
  },
);

export const sidebarBrandLayerVariants = cva('mm-sidebar-brand-layer transition-opacity duration-[260ms] ease-out', {
  variants: {
    mode: {
      expanded: 'mm-sidebar-brand-layer--expanded relative opacity-100',
      collapsed: 'mm-sidebar-brand-layer--collapsed pointer-events-none absolute inset-x-0 top-0 opacity-0',
    },
    visible: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    {
      mode: 'expanded',
      visible: false,
      class: 'pointer-events-none absolute inset-x-0 top-0 opacity-0',
    },
    {
      mode: 'collapsed',
      visible: true,
      class: 'relative opacity-100 pointer-events-auto',
    },
  ],
  defaultVariants: {
    mode: 'expanded',
    visible: true,
  },
});

export const sidebarNavShellVariants = cva(
  'mm-sidebar-nav-shell relative z-10 flex-1 overflow-y-auto overflow-x-hidden py-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
  {
    variants: {
      collapsed: {
        true: 'px-2',
        false: 'px-3',
      },
    },
    defaultVariants: {
      collapsed: false,
    },
  },
);

export const sidebarSectionLabelVariants = cva(
  'mm-sidebar-section-label mb-2 px-2 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-emerald-300/55',
);

export const sidebarNavPillVariants = cva(
  'mm-sidebar-nav-pill bg-white/92 text-slate-700 shadow-[0_2px_8px_-6px_rgba(0,0,0,0.12)] backdrop-blur-sm hover:bg-white',
);

export const sidebarChildPillVariants = cva(
  'mm-sidebar-child-pill bg-white/88 text-slate-600 shadow-[0_1px_6px_-4px_rgba(0,0,0,0.1)] hover:bg-white hover:text-[#0f2918]',
);

export const sidebarCollapsedNavButtonVariants = cva(
  'relative mx-auto flex size-11 items-center justify-center rounded-xl transition-colors duration-200 ease-out',
  {
    variants: {
      active: {
        true: 'border border-[#a3e635]/45 bg-[#163322] text-[#a3e635] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]',
        false: 'bg-white/8 text-emerald-300 hover:bg-white/14 hover:text-[#a3e635]',
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

export const sidebarNavGroupBaseVariants = cva(
  'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200 ease-out',
);

export const sidebarNavGroupActiveVariants = cva(
  mergeClasses(
    sidebarNavGroupBaseVariants(),
    'border-s-[3px] border-[#a3e635] bg-[#163322] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]',
  ),
);

export const sidebarGroupIconVariants = cva('flex size-8 shrink-0 items-center justify-center rounded-lg', {
  variants: {
    active: {
      true: 'bg-white/12 text-[#a3e635]',
      false: 'bg-emerald-50 text-emerald-700',
    },
  },
  defaultVariants: {
    active: false,
  },
});

export const sidebarCollapsedLogoVariants = cva(
  'mm-sidebar-collapsed-logo flex size-12 items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 shadow-sm ring-1 ring-[#0f2918]/10 [&_img]:h-full [&_img]:w-full [&_img]:object-contain',
);

export const sidebarFooterVariants = cva(
  'mm-sidebar-footer-shell relative z-10 mt-auto shrink-0 border-t border-white/8 bg-[#0a1f12]/75 backdrop-blur-sm',
  {
    variants: {
      collapsed: {
        true: 'space-y-2 p-2',
        false: 'p-3',
      },
    },
    defaultVariants: {
      collapsed: false,
    },
  },
);

export const sidebarQuickActionExpandedVariants = cva(
  'group flex items-center gap-3 rounded-xl border border-white/12 bg-white/10 px-3 py-3 transition-colors hover:border-[#a3e635]/35 hover:bg-white/14',
);

export const sidebarQuickActionCollapsedVariants = cva(
  'mx-auto flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#f7faf8] to-[#dfe9e3] text-[#0f2918] shadow-sm transition-transform hover:scale-105 hover:shadow-md',
);

export const sidebarFlyoutVariants = cva(
  'absolute top-0 z-40 min-w-[13rem] overflow-hidden rounded-xl border border-white/10 bg-[#132f1f] p-1.5 shadow-lg shadow-black/20',
);

export const sidebarNavLinkActiveVariants = cva(
  'mm-nav-link--active border-s-2 border-[#a3e635] bg-[#163322] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]',
);
