import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { PageStateComponent } from '../../../../../shared/components/page-state/page-state.component';
import {
  ANALYTICS_CHART_IDS,
  ACCOUNTS_CHART_IDS,
  ALERTS_CHART_IDS,
  DEFAULT_OVERVIEW_TAB,
  FINANCE_CHART_IDS,
  isOverviewTabId,
  OPERATIONS_CHART_IDS,
  SUBSCRIPTIONS_CHART_IDS,
  OverviewTabId,
} from '../../config/overview-tabs.config';
import { OverviewAlertsPanelComponent } from '../../components/overview-alerts-panel/overview-alerts-panel.component';
import { OverviewAnalyticsHighlightsComponent } from '../../components/overview-analytics-highlights/overview-analytics-highlights.component';
import { OverviewChartsSectionComponent } from '../../components/overview-charts-section/overview-charts-section.component';
import { OverviewDomainPanelsComponent } from '../../components/overview-domain-panels/overview-domain-panels.component';
import { OverviewKpiGridComponent } from '../../components/overview-kpi-grid/overview-kpi-grid.component';
import { OverviewPendingListComponent } from '../../components/overview-pending-list/overview-pending-list.component';
import { OverviewPageHeaderComponent } from '../../components/overview-page-header/overview-page-header.component';
import { OverviewQuickLinksComponent } from '../../components/overview-quick-links/overview-quick-links.component';
import { OverviewTabBadge } from '../../components/overview-section-nav/overview-section-nav.component';
import { OverviewOpsQueueComponent } from '../../components/overview-ops-queue/overview-ops-queue.component';
import { OverviewPeriod } from '../../models/overview.model';
import { OverviewStore } from '../../data/overview-store';

@Component({
  selector: 'mm-overview-page',
  standalone: true,
  imports: [
    PageStateComponent,
    OverviewPageHeaderComponent,
    OverviewAnalyticsHighlightsComponent,
    OverviewKpiGridComponent,
    OverviewChartsSectionComponent,
    OverviewDomainPanelsComponent,
    OverviewAlertsPanelComponent,
    OverviewQuickLinksComponent,
    OverviewPendingListComponent,
    OverviewOpsQueueComponent,
  ],
  templateUrl: './overview-page.component.html',
  styleUrl: './overview-page.component.scss',
})
export class OverviewPageComponent implements OnInit {
  readonly store = inject(OverviewStore);
  readonly locale = inject(AppLocaleService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly activeTab = signal<OverviewTabId>(DEFAULT_OVERVIEW_TAB);

  readonly data = this.store.data;
  readonly pageState = this.store.page;
  readonly filter = this.store.filter;

  readonly countryLabel = computed(() => {
    const d = this.data();
    if (!d) {
      return '';
    }
    return this.locale.isRtl() ? d.countryLabelAr : d.countryLabelEn;
  });

  readonly updatedAt = computed(() => {
    const d = this.data();
    if (!d) {
      return '';
    }
    return this.locale.isRtl() ? d.updatedAtAr : d.updatedAtEn;
  });

  readonly tabBadges = computed((): OverviewTabBadge[] => [
    { id: 'operations', count: 3 },
    { id: 'accounts', count: 16 },
    { id: 'support', count: 8 },
    { id: 'alerts', count: 3 },
  ]);

  readonly analyticsChartIds = [...ANALYTICS_CHART_IDS];
  readonly operationsChartIds = [...OPERATIONS_CHART_IDS];
  readonly accountsChartIds = [...ACCOUNTS_CHART_IDS];
  readonly subscriptionsChartIds = [...SUBSCRIPTIONS_CHART_IDS];
  readonly financeChartIds = [...FINANCE_CHART_IDS];
  readonly supportChartIds = [
    'complaints-trend',
    'complaint-types',
    'resolution-sla',
    'service-coverage',
  ];
  readonly alertsChartIds = [...ALERTS_CHART_IDS];

  ngOnInit(): void {
    const tabParam = this.route.snapshot.queryParamMap.get('tab');
    if (isOverviewTabId(tabParam)) {
      this.activeTab.set(tabParam);
    }
    this.store.loadOverview();
  }

  onPeriodChange(period: OverviewPeriod): void {
    this.store.setPeriod(period);
  }

  onRetry(): void {
    this.store.retry();
  }

  onTabChange(tabId: OverviewTabId): void {
    this.activeTab.set(tabId);
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tabId },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
