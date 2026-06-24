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
  lucideChevronDown,
  lucideChevronRight,
  lucideCircleHelp,
  lucideClock,
  lucideContactRound,
  lucideCreditCard,
  lucideDoorOpen,
  lucideEyeOff,
  lucideFileText,
  lucideFolderOpen,
  lucideGauge,
  lucideGift,
  lucideGlobe,
  lucideLanguages,
  lucideLayers,
  lucideLayoutDashboard,
  lucideLifeBuoy,
  lucideLogOut,
  lucideMapPin,
  lucideMapPinned,
  lucideMegaphone,
  lucideMessageSquare,
  lucideMessagesSquare,
  lucidePackage,
  lucidePanelLeftClose,
  lucidePanelLeftOpen,
  lucidePercent,
  lucidePhone,
  lucidePlus,
  lucideQrCode,
  lucideRadar,
  lucideRadio,
  lucideReceipt,
  lucideRefreshCw,
  lucideSearch,
  lucideSettings,
  lucideShare2,
  lucideShieldAlert,
  lucideSlidersHorizontal,
  lucideSnowflake,
  lucideStar,
  lucideStore,
  lucideTags,
  lucideTarget,
  lucideTicket,
  lucideTrendingUp,
  lucideTruck,
  lucideUndo2,
  lucideUserCheck,
  lucideUserRound,
  lucideUsers,
  lucideUsersRound,
  lucideUtensils,
  lucideWallet,
  lucideWandSparkles,
} from '@ng-icons/lucide';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { BRAND_ASSETS } from '@/core/brand/brand-assets';
import {
  AdminShellLayoutService,
  AdminViewport,
} from '@/core/layout/admin-shell-layout.service';
import {
  ADMIN_NAV_SECTIONS,
  ADMIN_QUICK_ACTION,
} from '@/core/navigation/admin-nav.config';
import { AdminNavItem, AdminNavSection } from '@/core/navigation/admin-nav.model';
import { mergeClasses } from '@/shared/utils/merge-classes';

/** Demo badges — hide until wired to live counts */
const SHOW_NAV_BADGES = false;

const SIDEBAR_TRANSITION_MS = 360;

@Component({
  selector: 'mm-admin-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIcon],
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
      lucideChartBar,
      lucideChevronDown,
      lucideChevronRight,
      lucideCircleHelp,
      lucideClock,
      lucideContactRound,
      lucideCreditCard,
      lucideDoorOpen,
      lucideEyeOff,
      lucideFileText,
      lucideFolderOpen,
      lucideGauge,
      lucideGift,
      lucideGlobe,
      lucideLanguages,
      lucideLayers,
      lucideLayoutDashboard,
      lucideLifeBuoy,
      lucideLogOut,
      lucideMapPin,
      lucideMapPinned,
      lucideMegaphone,
      lucideMessageSquare,
      lucideMessagesSquare,
      lucidePackage,
      lucidePanelLeftClose,
      lucidePanelLeftOpen,
      lucidePercent,
      lucidePhone,
      lucidePlus,
      lucideQrCode,
      lucideRadar,
      lucideRadio,
      lucideReceipt,
      lucideRefreshCw,
      lucideSearch,
      lucideSettings,
      lucideShare2,
      lucideShieldAlert,
      lucideSlidersHorizontal,
      lucideSnowflake,
      lucideStar,
      lucideStore,
      lucideTags,
      lucideTarget,
      lucideTicket,
      lucideTrendingUp,
      lucideTruck,
      lucideUndo2,
      lucideUserCheck,
      lucideUserRound,
      lucideUsers,
      lucideUsersRound,
      lucideUtensils,
      lucideWallet,
      lucideWandSparkles,
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
  readonly brandIconSrc = BRAND_ASSETS.icon;
  readonly collapsed = signal(false);
  readonly showDetails = signal(true);
  readonly animating = signal(false);
  readonly currentUrl = signal(this.router.url);
  readonly navSearchQuery = signal('');
  readonly flyoutSearchQuery = signal('');
  readonly flyoutSectionId = signal<string | null>(null);
  readonly showNavBadges = SHOW_NAV_BADGES;

  private flyoutHideTimer: ReturnType<typeof setTimeout> | null = null;

  @HostBinding('style.width')
  get sidebarWidth(): string | null {
    if (this.layout.isMobile()) {
      return this.layout.mobileNavOpen() ? 'var(--mm-sidebar-mobile)' : '0px';
    }

    return this.collapsed()
      ? 'var(--mm-sidebar-rail)'
      : 'var(--mm-sidebar-expanded)';
  }

  readonly activeSection = computed(() => {
    const url = this.currentUrl();
    for (const section of ADMIN_NAV_SECTIONS) {
      if (this.sectionMatchesUrl(section, url)) {
        return section;
      }
    }
    return ADMIN_NAV_SECTIONS[0];
  });

  readonly activeSectionTitle = computed(() => {
    const section = this.activeSection();
    return this.locale.isRtl() ? section.labelAr : section.labelEn;
  });

  readonly panelItems = computed(() => this.resolvePanelItems(this.activeSection()));

  readonly filteredPanelItems = computed(() =>
    this.filterItems(this.panelItems(), this.navSearchQuery()),
  );

  readonly flyoutSection = computed(() => {
    const id = this.flyoutSectionId();
    if (!id) return null;
    return ADMIN_NAV_SECTIONS.find((s) => s.id === id) ?? null;
  });

  readonly quickActionHint = computed(() =>
    this.locale.isRtl() ? 'فتح نموذج الاستثناء' : 'Open exception form',
  );

  readonly logoutLabel = computed(() =>
    this.locale.isRtl() ? 'تسجيل الخروج' : 'Log out',
  );

  readonly collapseLabel = computed(() =>
    this.locale.isRtl() ? 'طي القائمة' : 'Collapse sidebar',
  );

  readonly expandLabel = computed(() =>
    this.locale.isRtl() ? 'فتح القائمة' : 'Expand sidebar',
  );

  constructor() {
    effect(() => {
      this.applyViewportLayout(this.layout.viewport());
    });

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => {
        const url = (event as NavigationEnd).urlAfterRedirects;
        this.currentUrl.set(url);
        this.navSearchQuery.set('');
        this.flyoutSearchQuery.set('');
        this.flyoutSectionId.set(null);
        this.layout.onRouteChange();
      });
  }

  sectionLabel(section: AdminNavSection): string {
    return this.locale.isRtl() ? section.labelAr : section.labelEn;
  }

  sectionIcon(section: AdminNavSection): string {
    return section.items[0]?.icon ?? 'lucideLayoutDashboard';
  }

  sectionBadgeTotal(section: AdminNavSection): number {
    const item = section.items[0];
    if (!item?.children?.length) {
      return item?.badge ?? 0;
    }
    return item.children.reduce((total, child) => total + (child.badge ?? 0), 0);
  }

  isSectionActive(section: AdminNavSection): boolean {
    return this.activeSection().id === section.id;
  }

  searchPlaceholder(): string {
    return this.locale.isRtl() ? 'بحث...' : 'Search...';
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

  onRailSectionClick(section: AdminNavSection): void {
    if (this.collapsed()) {
      this.flyoutSectionId.set(section.id);
      this.flyoutSearchQuery.set('');
      return;
    }

    const target = this.defaultRouteForSection(section);
    if (target && !this.sectionMatchesUrl(section, this.currentUrl())) {
      void this.router.navigateByUrl(target);
    }
  }

  onRailHover(sectionId: string): void {
    if (!this.collapsed()) {
      return;
    }

    if (this.flyoutHideTimer) {
      clearTimeout(this.flyoutHideTimer);
      this.flyoutHideTimer = null;
    }

    this.flyoutSectionId.set(sectionId);
  }

  onRailLeave(): void {
    if (!this.collapsed()) {
      return;
    }

    this.flyoutHideTimer = setTimeout(() => this.flyoutSectionId.set(null), 180);
  }

  onFlyoutEnter(): void {
    if (this.flyoutHideTimer) {
      clearTimeout(this.flyoutHideTimer);
      this.flyoutHideTimer = null;
    }
  }

  hideFlyout(): void {
    this.flyoutSectionId.set(null);
  }

  onNavSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.navSearchQuery.set(input.value);
  }

  onFlyoutSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.flyoutSearchQuery.set(input.value);
  }

  flyoutPanelItems(section: AdminNavSection): AdminNavItem[] {
    return this.resolvePanelItems(section);
  }

  filteredFlyoutItems(section: AdminNavSection): AdminNavItem[] {
    return this.filterItems(this.flyoutPanelItems(section), this.flyoutSearchQuery());
  }

  label(item: AdminNavItem): string {
    return this.locale.isRtl() ? item.labelAr : item.labelEn;
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

  flyoutClass(): string {
    return mergeClasses(
      'mm-sb-flyout mm-sb-flyout--dual mm-sb-flyout--in',
      this.locale.isRtl() ? 'end-full me-2' : 'start-full ms-2',
    );
  }

  logout(): void {
    this.auth.logout();
  }

  private resolvePanelItems(section: AdminNavSection): AdminNavItem[] {
    const item = section.items[0];
    if (!item) {
      return [];
    }

    if (item.children?.length) {
      return item.children;
    }

    if (item.route) {
      return [item];
    }

    return [];
  }

  private filterItems(items: AdminNavItem[], query: string): AdminNavItem[] {
    const q = query.toLowerCase().trim();
    if (!q) {
      return items;
    }

    return items.filter((item) => {
      const ar = item.labelAr.toLowerCase();
      const en = item.labelEn.toLowerCase();
      return ar.includes(q) || en.includes(q);
    });
  }

  private sectionMatchesUrl(section: AdminNavSection, url: string): boolean {
    for (const item of section.items) {
      if (item.route && url.startsWith(item.route)) {
        return true;
      }

      if (item.children?.some((child) => child.route && url.startsWith(child.route))) {
        return true;
      }
    }

    return false;
  }

  private defaultRouteForSection(section: AdminNavSection): string | null {
    const item = section.items[0];
    if (!item) {
      return null;
    }

    if (item.route) {
      return item.route;
    }

    return item.children?.[0]?.route ?? null;
  }

  private applyViewportLayout(viewport: AdminViewport): void {
    this.flyoutSectionId.set(null);

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

    this.flyoutSectionId.set(null);

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
}
