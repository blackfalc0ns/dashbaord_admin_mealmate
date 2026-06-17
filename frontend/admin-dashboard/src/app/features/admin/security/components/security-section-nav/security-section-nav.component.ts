import { Component, computed, inject, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideLayoutDashboard,
  lucideShield,
  lucideUsers,
} from '@ng-icons/lucide';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import {
  SECURITY_ACCESS_PANELS,
  SECURITY_USERS_PANELS,
  SECURITY_WORKSPACE_TABS,
  SecurityAccessPanel,
  SecurityAccessPanelDefinition,
  SecurityUsersPanel,
  SecurityUsersPanelDefinition,
  SecurityWorkspaceTab,
  SecurityWorkspaceTabDefinition,
} from '../../config/security-workspace.config';
import {
  securityNavBadgeVariants,
  securitySectionNavIconVariants,
  securitySectionNavItemHeadVariants,
  securitySectionNavItemVariants,
  securitySectionNavLabelVariants,
  securitySectionNavVariants,
  securitySubNavItemVariants,
  securitySubNavLabelVariants,
  securitySubNavVariants,
} from './security-section-nav.variants';

const NAV_ICONS = {
  lucideLayoutDashboard,
  lucideShield,
  lucideUsers,
};

@Component({
  selector: 'mm-security-section-nav',
  standalone: true,
  imports: [NgIcon],
  providers: [provideIcons(NAV_ICONS)],
  templateUrl: './security-section-nav.component.html',
  host: {
    class: 'flex w-full flex-col items-start gap-2',
  },
})
export class SecuritySectionNavComponent {
  readonly locale = inject(AppLocaleService);
  readonly activeTab = input.required<SecurityWorkspaceTab>();
  readonly activeAccessPanel = input<SecurityAccessPanel>('roles');
  readonly activeUsersPanel = input<SecurityUsersPanel>('directory');
  readonly tabChange = output<SecurityWorkspaceTab>();
  readonly accessPanelChange = output<SecurityAccessPanel>();
  readonly usersPanelChange = output<SecurityUsersPanel>();

  readonly tabs = SECURITY_WORKSPACE_TABS;

  readonly subPanels = computed((): Array<SecurityAccessPanelDefinition | SecurityUsersPanelDefinition> => {
    if (this.activeTab() === 'access') {
      return SECURITY_ACCESS_PANELS;
    }

    if (this.activeTab() === 'users') {
      return SECURITY_USERS_PANELS;
    }

    return [];
  });

  readonly activeSubPanel = computed(() => {
    if (this.activeTab() === 'access') {
      return this.activeAccessPanel();
    }

    if (this.activeTab() === 'users') {
      return this.activeUsersPanel();
    }

    return null;
  });

  navClass(): string {
    return securitySectionNavVariants();
  }

  itemClass(tabId: SecurityWorkspaceTab): string {
    return securitySectionNavItemVariants({ active: this.activeTab() === tabId });
  }

  itemHeadClass(): string {
    return securitySectionNavItemHeadVariants();
  }

  iconClass(tabId: SecurityWorkspaceTab): string {
    return securitySectionNavIconVariants({ active: this.activeTab() === tabId });
  }

  labelClass(): string {
    return securitySectionNavLabelVariants();
  }

  badgeClass(tabId: SecurityWorkspaceTab): string {
    return securityNavBadgeVariants({ active: this.activeTab() === tabId });
  }

  subNavClass(): string {
    return securitySubNavVariants();
  }

  subItemClass(panelId: string): string {
    return securitySubNavItemVariants({ active: this.activeSubPanel() === panelId });
  }

  subLabelClass(): string {
    return securitySubNavLabelVariants();
  }

  label(tab: SecurityWorkspaceTabDefinition): string {
    return this.locale.isRtl() ? tab.labelAr : tab.labelEn;
  }

  subLabel(panel: SecurityAccessPanelDefinition | SecurityUsersPanelDefinition): string {
    return this.locale.isRtl() ? panel.labelAr : panel.labelEn;
  }

  selectTab(tabId: SecurityWorkspaceTab): void {
    this.tabChange.emit(tabId);
  }

  selectSubPanel(panelId: string): void {
    if (this.activeTab() === 'access' && panelId) {
      this.accessPanelChange.emit(panelId as SecurityAccessPanel);
      return;
    }

    if (this.activeTab() === 'users' && panelId) {
      this.usersPanelChange.emit(panelId as SecurityUsersPanel);
    }
  }
}
