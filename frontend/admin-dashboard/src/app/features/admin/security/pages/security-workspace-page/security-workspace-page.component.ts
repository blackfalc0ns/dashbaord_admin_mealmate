import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { SecurityWorkspaceHeaderComponent } from '../../components/security-workspace-header/security-workspace-header.component';
import { SecurityOverviewPanelComponent } from '../../components/security-overview-panel/security-overview-panel.component';
import { SecurityWorkspacePanelComponent } from '../../components/security-workspace-panel/security-workspace-panel.component';
import {
  DEFAULT_ACCESS_PANEL,
  DEFAULT_SECURITY_TAB,
  DEFAULT_USERS_PANEL,
  isSecurityAccessPanel,
  isSecurityUsersPanel,
  isSecurityWorkspaceTab,
  legacySecurityRoute,
  resolveSecurityPageId,
  SecurityAccessPanel,
  SecurityUsersPanel,
  SecurityWorkspaceTab,
} from '../../config/security-workspace.config';
import { SECURITY_ADMIN_PAGES } from '../../data/security-admin-pages.data';

@Component({
  selector: 'mm-security-workspace-page',
  standalone: true,
  imports: [
    SecurityWorkspaceHeaderComponent,
    SecurityOverviewPanelComponent,
    SecurityWorkspacePanelComponent,
  ],
  templateUrl: './security-workspace-page.component.html',
})
export class SecurityWorkspacePageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly locale = inject(AppLocaleService);

  readonly activeTab = signal<SecurityWorkspaceTab>(DEFAULT_SECURITY_TAB);
  readonly accessPanel = signal<SecurityAccessPanel>(DEFAULT_ACCESS_PANEL);
  readonly usersPanel = signal<SecurityUsersPanel>(DEFAULT_USERS_PANEL);

  readonly activePage = computed(() => {
    const pageId = resolveSecurityPageId(this.activeTab(), this.accessPanel(), this.usersPanel());
    return pageId ? SECURITY_ADMIN_PAGES[pageId] : null;
  });

  ngOnInit(): void {
    this.syncFromRoute();

    this.route.queryParamMap.subscribe(() => {
      this.syncFromRoute();
    });
  }

  onTabChange(tab: SecurityWorkspaceTab): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.buildQueryParams(tab, this.accessPanel(), this.usersPanel()),
    });
  }

  onAccessPanelChange(panel: SecurityAccessPanel): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.buildQueryParams('access', panel, this.usersPanel()),
    });
  }

  onUsersPanelChange(panel: SecurityUsersPanel): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.buildQueryParams('users', this.accessPanel(), panel),
    });
  }

  onOverviewJump(event: { tab: SecurityWorkspaceTab; panel?: string }): void {
    const accessPanel = isSecurityAccessPanel(event.panel) ? event.panel : this.accessPanel();
    const usersPanel = isSecurityUsersPanel(event.panel) ? event.panel : this.usersPanel();

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.buildQueryParams(event.tab, accessPanel, usersPanel),
    });
  }

  private syncFromRoute(): void {
    const legacy = legacySecurityRoute(this.router.url.split('?')[0]);
    if (legacy && !this.route.snapshot.queryParamMap.get('tab')) {
      void this.router.navigate(['/admin/security'], {
        queryParams: this.buildQueryParams(
          legacy.tab,
          isSecurityAccessPanel(legacy.panel) ? legacy.panel : DEFAULT_ACCESS_PANEL,
          isSecurityUsersPanel(legacy.panel) ? legacy.panel : DEFAULT_USERS_PANEL,
        ),
        replaceUrl: true,
      });
      return;
    }

    const tabParam = this.route.snapshot.queryParamMap.get('tab');
    const panelParam = this.route.snapshot.queryParamMap.get('panel');

    const tab = isSecurityWorkspaceTab(tabParam) ? tabParam : DEFAULT_SECURITY_TAB;
    this.activeTab.set(tab);

    if (tab === 'access') {
      this.accessPanel.set(isSecurityAccessPanel(panelParam) ? panelParam : DEFAULT_ACCESS_PANEL);
      return;
    }

    if (tab === 'users') {
      this.usersPanel.set(isSecurityUsersPanel(panelParam) ? panelParam : DEFAULT_USERS_PANEL);
    }
  }

  private buildQueryParams(
    tab: SecurityWorkspaceTab,
    accessPanel: SecurityAccessPanel,
    usersPanel: SecurityUsersPanel,
  ): Record<string, string> {
    if (tab === 'overview') {
      return { tab };
    }

    if (tab === 'access') {
      return { tab, panel: accessPanel };
    }

    return { tab, panel: usersPanel };
  }
}
