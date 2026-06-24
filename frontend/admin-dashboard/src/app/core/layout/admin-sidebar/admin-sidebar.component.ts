import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  HostBinding,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthFacade } from '@/features/auth/state/auth.facade';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideAward,
  lucideChartBar,
  lucideCircleAlert,
  lucideClock,
  lucideCreditCard,
  lucideFileText,
  lucideLayers,
  lucideLayoutDashboard,
  lucideLifeBuoy,
  lucideLogOut,
  lucideMapPin,
  lucideMapPinned,
  lucideMegaphone,
  lucideMessageSquare,
  lucidePackage,
  lucidePanelLeftClose,
  lucidePanelLeftOpen,
  lucidePercent,
  lucidePhone,
  lucidePlus,
  lucideRadar,
  lucideReceipt,
  lucideRefreshCw,
  lucideSettings,
  lucideShieldAlert,
  lucideSlidersHorizontal,
  lucideStore,
  lucideTags,
  lucideTarget,
  lucideTicket,
  lucideTruck,
  lucideUndo2,
  lucideUserCheck,
  lucideUserRound,
  lucideUsers,
  lucideWallet,
  lucideChevronDown,
  lucideChevronRight,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { BRAND_ASSETS } from '@/core/brand/brand-assets';
import {
  AdminShellLayoutService,
  AdminViewport,
} from '@/core/layout/admin-shell-layout.service';
import {
  ADMIN_NAV_ITEMS,
  ADMIN_NAV_SECTIONS,
  ADMIN_QUICK_ACTION,
} from '@/core/navigation/admin-nav.config';
import { AdminNavItem, AdminNavSection } from '@/core/navigation/admin-nav.model';
import {
  MmSidebarLogoutButtonComponent,
} from '@/shared/components/layout';
import { mergeClasses } from '@/shared/utils/merge-classes';

/** Demo badges — hide until wired to live counts */
const SHOW_NAV_BADGES = false;

const SIDEBAR_TRANSITION_MS = 360;

@Component({
  selector: 'mm-admin-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIcon, MmSidebarLogoutButtonComponent],
  templateUrl: './admin-sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mm-admin-sidebar-host',
    '[class.mm-admin-sidebar-host--collapsed]': 'collapsed()',
    '[class.mm-admin-sidebar-host--animating]': 'animating()',
    '[class.mm-admin-sidebar-host--mobile]': 'layout.isMobile()',
    '[class.mm-admin-sidebar-host--overlay-open]': 'layout.mobileNavOpen()',
    '[class.mm-admin-sidebar-host--tablet]': 'layout.isTablet()',
  },
  viewProviders: [
    provideIcons({
      lucideAward,
      lucideCircleAlert,
      lucideChevronDown,
      lucideChevronRight,
      lucideClock,
      lucideCreditCard,
      lucideFileText,
      lucideLayers,
      lucideLayoutDashboard,
      lucideLifeBuoy,
      lucideLogOut,
      lucideMapPin,
      lucideMapPinned,
      lucideMegaphone,
      lucideMessageSquare,
      lucidePackage,
      lucidePanelLeftClose,
      lucidePanelLeftOpen,
      lucidePercent,
      lucidePhone,
      lucidePlus,
      lucideRadar,
      lucideReceipt,
      lucideRefreshCw,
      lucideSettings,
      lucideShieldAlert,
      lucideSlidersHorizontal,
      lucideStore,
      lucideTags,
      lucideChartBar,
      lucideTarget,
      lucideTicket,
      lucideTruck,
      lucideUndo2,
      lucideUserCheck,
      lucideUserRound,
      lucideUsers,
      lucideWallet,
    }),
  ],
})
export class AdminSidebarComponent {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthFacade);
  private readonly destroyRef = inject(DestroyRef);
  readonly locale = inject(AppLocaleService);
  readonly layout = inject(AdminShellLayoutService);

  readonly navSections = ADMIN_NAV_SECTIONS;
  readonly quickAction = ADMIN_QUICK_ACTION;
  readonly brandLogoSrc = BRAND_ASSETS.full;
  readonly brandIconSrc = BRAND_ASSETS.icon;
  readonly collapsed = signal(false);
  readonly showDetails = signal(true);
  readonly animating = signal(false);

  @HostBinding('style.width')
  get sidebarWidth(): string | null {
    if (this.layout.isMobile()) {
      return this.layout.mobileNavOpen() ? 'var(--mm-sidebar-mobile)' : '0px';
    }

    return this.collapsed()
      ? 'var(--mm-sidebar-rail)'
      : 'var(--mm-sidebar-expanded)';
  }

  readonly expandedGroups = signal<Record<string, boolean>>({
    'operations-72h': true,
    'accounts-group': true,
  });
  readonly flyoutGroupId = signal<string | null>(null);
  readonly showNavBadges = SHOW_NAV_BADGES;

  readonly greeting = computed(() =>
    this.locale.isRtl() ? 'مرحباً 👋' : 'Hello 👋',
  );

  readonly adminLabel = computed(() =>
    this.locale.isRtl() ? 'مسؤول النظام' : 'System Admin',
  );

  readonly quickActionHint = computed(() =>
    this.locale.isRtl() ? 'فتح نموذج الاستثناء' : 'Open exception form',
  );

  readonly shiftLabel = computed(() =>
    this.locale.isRtl() ? 'وردية الصباح' : 'Morning shift',
  );

  readonly onlineLabel = computed(() =>
    this.locale.isRtl() ? 'متصل الآن' : 'Online now',
  );

  readonly logoutLabel = computed(() =>
    this.locale.isRtl() ? 'تسجيل الخروج' : 'Log out',
  );

  readonly logoutHint = computed(() =>
    this.locale.isRtl() ? 'إنهاء الجلسة الحالية' : 'End current session',
  );

  constructor() {
    this.syncExpandedFromUrl(this.router.url);

    effect(() => {
      this.applyViewportLayout(this.layout.viewport());
    });

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.syncExpandedFromUrl(this.router.url);
        this.layout.onRouteChange();
      });
  }

  sectionLabel(section: AdminNavSection): string {
    return this.locale.isRtl() ? section.labelAr : section.labelEn;
  }

  toggleCollapsed(): void {
    if (this.layout.isMobile()) {
      this.layout.closeMobileNav();
      return;
    }

    const willCollapse = !this.collapsed();

    if (this.layout.isDesktopUp()) {
      this.layout.setUserCollapsed(willCollapse);
    }

    this.setCollapsed(willCollapse);
  }

  closeMobileNav(): void {
    this.layout.closeMobileNav();
  }

  onNavGroupClick(item: AdminNavItem): void {
    if (this.collapsed()) {
      this.flyoutGroupId.set(item.id);
      return;
    }

    this.toggleGroup(item.id);
  }

  toggleGroup(id: string): void {
    this.expandedGroups.update((groups) => ({
      ...groups,
      [id]: !groups[id],
    }));
  }

  isGroupExpanded(id: string): boolean {
    return this.expandedGroups()[id] ?? false;
  }

  isGroupActive(item: AdminNavItem): boolean {
    if (!item.children?.length) {
      return item.route ? this.router.url.startsWith(item.route) : false;
    }

    return item.children.some((child) =>
      child.route ? this.router.url.startsWith(child.route) : false,
    );
  }

  label(item: AdminNavItem): string {
    return this.locale.isRtl() ? item.labelAr : item.labelEn;
  }

  groupBadgeTotal(item: AdminNavItem): number {
    return (
      item.children?.reduce((total, child) => total + (child.badge ?? 0), 0) ?? 0
    );
  }

  formatBadge(value: number): string {
    return value > 99 ? '99+' : String(value);
  }

  isExactNavRoute(route?: string): boolean {
    if (!route) {
      return false;
    }

    return (
      route === '/admin/overview' ||
      route === '/admin/operations/orders' ||
      route.startsWith('/admin/security')
    );
  }

  badgeClasses(value: number, onActive = false): string {
    const sizing =
      'flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[0.65rem] font-bold';

    if (value >= 100) {
      return onActive
        ? `${sizing} min-w-6 bg-emerald-200 px-1.5 text-[0.6rem] text-emerald-900`
        : `${sizing} min-w-6 bg-emerald-100 px-1.5 text-[0.6rem] text-emerald-800`;
    }

    return `${sizing} bg-amber-400 text-amber-950`;
  }

  groupBadgeClasses(item: AdminNavItem): string {
    return this.badgeClasses(this.groupBadgeTotal(item), this.isGroupActive(item));
  }

  navItemClass(item: AdminNavItem): string {
    const active = this.isGroupActive(item);

    if (this.collapsed()) {
      return mergeClasses('mm-sb-item mm-sb-item--rail', active ? 'mm-sb-item--active' : '');
    }

    return mergeClasses('mm-sb-item', active ? 'mm-sb-item--active' : '');
  }

  flyoutClass(): string {
    return mergeClasses(
      'mm-sb-flyout',
      this.locale.isRtl() ? 'end-full me-2.5' : 'start-full ms-2.5',
    );
  }

  hasCollapsedBadge(item: AdminNavItem): boolean {
    return this.groupBadgeTotal(item) > 0;
  }

  showFlyout(id: string): void {
    if (!this.collapsed()) {
      return;
    }

    this.flyoutGroupId.set(id);
  }

  hideFlyout(): void {
    this.flyoutGroupId.set(null);
  }

  isFlyoutOpen(id: string): boolean {
    return this.collapsed() && this.flyoutGroupId() === id;
  }

  logout(): void {
    this.auth.logout();
  }

  private applyViewportLayout(viewport: AdminViewport): void {
    this.flyoutGroupId.set(null);

    if (viewport === 'mobile') {
      this.setCollapsed(false, { animate: false });
      return;
    }

    if (viewport === 'tablet') {
      this.setCollapsed(true, { animate: false });
      return;
    }

    this.setCollapsed(this.layout.userCollapsed(), { animate: false });
  }

  private setCollapsed(collapsed: boolean, options: { animate?: boolean } = {}): void {
    const animate = options.animate ?? true;

    if (animate) {
      this.animating.set(true);
    }

    this.flyoutGroupId.set(null);

    if (collapsed) {
      this.showDetails.set(false);
      if (animate) {
        requestAnimationFrame(() => this.collapsed.set(true));
      } else {
        this.collapsed.set(true);
      }
    } else {
      this.collapsed.set(false);
      if (animate) {
        window.setTimeout(() => this.showDetails.set(true), SIDEBAR_TRANSITION_MS);
      } else {
        this.showDetails.set(true);
      }
    }

    if (animate) {
      window.setTimeout(() => this.animating.set(false), SIDEBAR_TRANSITION_MS + 20);
    }
  }

  private syncExpandedFromUrl(url: string): void {
    for (const item of ADMIN_NAV_ITEMS) {
      if (!item.children?.length) {
        continue;
      }

      const active = item.children.some((child) =>
        child.route ? url.startsWith(child.route) : false,
      );

      if (active) {
        this.expandedGroups.update((groups) => ({ ...groups, [item.id]: true }));
      }
    }
  }
}
