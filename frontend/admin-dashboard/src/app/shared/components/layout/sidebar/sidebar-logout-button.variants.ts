import { cva } from 'class-variance-authority';

export const sidebarLogoutButtonVariants = cva(
  'mm-sidebar-logout-btn group flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-start transition-all duration-200 ease-out hover:border-rose-300/25 hover:bg-rose-500/10',
  {
    variants: {
      collapsed: {
        true: 'mm-sidebar-logout-btn--collapsed mx-auto size-11 items-center justify-center gap-0 border-white/12 bg-white/6 p-0 hover:border-rose-300/30 hover:bg-rose-500/12',
        false: '',
      },
    },
    defaultVariants: {
      collapsed: false,
    },
  },
);

export const sidebarLogoutIconVariants = cva(
  'mm-sidebar-logout-btn__icon flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/8 text-rose-200/90 transition-colors duration-200 group-hover:bg-rose-500/15 group-hover:text-rose-200',
  {
    variants: {
      collapsed: {
        true: 'size-full rounded-xl bg-transparent',
        false: '',
      },
    },
    defaultVariants: {
      collapsed: false,
    },
  },
);

export const sidebarLogoutGlyphVariants = cva(
  "mm-sidebar-logout-btn__glyph size-5 shrink-0 [&_svg]:block [&_svg]:h-full [&_svg]:w-full",
);
