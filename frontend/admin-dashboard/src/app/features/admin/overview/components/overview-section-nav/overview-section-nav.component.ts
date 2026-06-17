import { Component, inject, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBell,
  lucideClock,
  lucideLayoutDashboard,
  lucideLifeBuoy,
  lucideChartArea,
  lucideTags,
  lucideUsers,
  lucideWallet,
} from '@ng-icons/lucide';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import {
  OVERVIEW_TABS,
  OverviewTabDefinition,
  OverviewTabId,
} from '../../config/overview-tabs.config';
import {
  overviewSectionNavBadgeVariants,
  overviewSectionNavIconVariants,
  overviewSectionNavItemVariants,
  overviewSectionNavLabelVariants,
  overviewSectionNavVariants,
} from './overview-section-nav.variants';

const TAB_ICONS = {
  lucideLayoutDashboard,
  lucideChartArea,
  lucideClock,
  lucideUsers,
  lucideTags,
  lucideWallet,
  lucideLifeBuoy,
  lucideBell,
};

export interface OverviewTabBadge {
  id: OverviewTabId;
  count: number;
}

@Component({
  selector: 'mm-overview-section-nav',
  standalone: true,
  imports: [NgIcon],
  providers: [provideIcons(TAB_ICONS)],
  templateUrl: './overview-section-nav.component.html',
  host: {
    class: 'block min-w-0 w-full',
  },
})
export class OverviewSectionNavComponent {
  readonly locale = inject(AppLocaleService);
  readonly activeId = input.required<OverviewTabId>();
  readonly badges = input<OverviewTabBadge[]>([]);
  readonly embedded = input(false);
  readonly tabChange = output<OverviewTabId>();

  readonly tabs = OVERVIEW_TABS;

  navClass(): string {
    return overviewSectionNavVariants({ embedded: this.embedded() });
  }

  itemClass(tabId: OverviewTabId): string {
    return overviewSectionNavItemVariants({
      embedded: this.embedded(),
      active: this.activeId() === tabId,
    });
  }

  iconClass(tabId: OverviewTabId): string {
    return overviewSectionNavIconVariants({
      embedded: this.embedded(),
      active: this.activeId() === tabId,
    });
  }

  labelClass(): string {
    return overviewSectionNavLabelVariants({ embedded: this.embedded() });
  }

  badgeClass(tabId: OverviewTabId): string {
    return overviewSectionNavBadgeVariants({
      embedded: this.embedded(),
      active: this.activeId() === tabId,
    });
  }

  label(tab: OverviewTabDefinition): string {
    return this.locale.isRtl() ? tab.labelAr : tab.labelEn;
  }

  badgeCount(tabId: OverviewTabId): number | undefined {
    return this.badges().find((b) => b.id === tabId)?.count;
  }

  select(tabId: OverviewTabId): void {
    this.tabChange.emit(tabId);
  }
}
