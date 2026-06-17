export interface OverviewChartSeries {
  name: string;
  data: number[];
}

export type OverviewPeriod = 'today' | '7d' | '30d' | 'month';

export interface OverviewKpiMetric {
  id: string;
  labelAr: string;
  labelEn: string;
  value: number;
  displayValue: string;
  deltaPercent: number;
  route: string;
  icon: string;
  sparkline: number[];
  format: 'number' | 'currency' | 'percent';
}

export interface OverviewChartStat {
  labelAr: string;
  labelEn: string;
  value: string;
  tone?: 'default' | 'success' | 'warning' | 'danger';
}

export interface OverviewChartPanel {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  route: string;
  chartType: 'area' | 'stackedBar' | 'donut' | 'horizontalBar' | 'line' | 'bar';
  series: OverviewChartSeries[] | number[];
  categories: string[];
  labels?: string[];
  stats?: OverviewChartStat[];
  groupAr?: string;
  groupEn?: string;
  standaloneGroupAr?: string;
  standaloneGroupEn?: string;
  span?: 'full' | 'half';
  sortOrder?: number;
  merged?: boolean;
  mergePair?: string;
}

export interface OverviewAnalyticsHighlight {
  id: string;
  labelAr: string;
  labelEn: string;
  value: string;
  hintAr: string;
  hintEn: string;
  deltaPercent?: number;
  tone?: 'default' | 'success' | 'warning' | 'danger';
}

export interface OverviewOpsQueueItem {
  id: string;
  labelAr: string;
  labelEn: string;
  route: string;
  severity: 'critical' | 'warning' | 'default';
  timeAgoAr: string;
  timeAgoEn: string;
}

export interface OverviewDomainMetric {
  labelAr: string;
  labelEn: string;
  value: number;
  displayValue?: string;
  max?: number;
  route: string;
  tone?: 'default' | 'warning' | 'danger' | 'success';
}

export interface OverviewDomainPanel {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  route: string;
  metrics: OverviewDomainMetric[];
  footerNoteAr?: string;
  footerNoteEn?: string;
}

export interface OverviewAlertItem {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  route: string;
  severity: 'info' | 'warning' | 'critical';
  timeAgoAr: string;
  timeAgoEn: string;
}

export interface OverviewActivityItem {
  id: string;
  textAr: string;
  textEn: string;
  route: string;
  timeAgoAr: string;
  timeAgoEn: string;
}

export interface OverviewQuickLink {
  id: string;
  labelAr: string;
  labelEn: string;
  route: string;
  icon: string;
  badge?: number;
}

export interface OverviewWorkflowBlock {
  id: string;
  tabId: OverviewTabId;
  featureRef: string;
  titleAr: string;
  titleEn: string;
  goalAr: string;
  goalEn: string;
  stepsAr: string[];
  stepsEn: string[];
  rulesAr: string[];
  rulesEn: string[];
  route?: string;
  routeLabelAr?: string;
  routeLabelEn?: string;
}

export interface OverviewPendingItem {
  id: string;
  nameAr: string;
  nameEn: string;
  typeAr: string;
  typeEn: string;
  submittedAtAr: string;
  submittedAtEn: string;
  statusAr: string;
  statusEn: string;
  statusTone?: 'default' | 'warning' | 'danger' | 'success';
  route: string;
}

export interface OverviewTimelineItem {
  id: string;
  labelAr: string;
  labelEn: string;
  offsetAr: string;
  offsetEn: string;
  descriptionAr: string;
  descriptionEn: string;
}

export interface OverviewSnapshotMetric {
  id: string;
  labelAr: string;
  labelEn: string;
  value: number;
  displayValue: string;
  route: string;
  tone?: 'default' | 'warning' | 'danger' | 'success';
}

export type OverviewTabId =
  | 'summary'
  | 'analytics'
  | 'operations'
  | 'accounts'
  | 'subscriptions'
  | 'finance'
  | 'support'
  | 'alerts';

export interface OverviewDashboardResponse {
  period: OverviewPeriod;
  countryLabelAr: string;
  countryLabelEn: string;
  updatedAtAr: string;
  updatedAtEn: string;
  snapshotMetrics: OverviewSnapshotMetric[];
  analyticsHighlights: OverviewAnalyticsHighlight[];
  operationsHighlights: OverviewAnalyticsHighlight[];
  accountsHighlights: OverviewAnalyticsHighlight[];
  subscriptionsHighlights: OverviewAnalyticsHighlight[];
  financeHighlights: OverviewAnalyticsHighlight[];
  supportHighlights: OverviewAnalyticsHighlight[];
  alertsHighlights: OverviewAnalyticsHighlight[];
  operationsQueue: OverviewOpsQueueItem[];
  subscriptionsInsights: OverviewOpsQueueItem[];
  financeInsights: OverviewOpsQueueItem[];
  supportInsights: OverviewOpsQueueItem[];
  kpis: OverviewKpiMetric[];
  charts: OverviewChartPanel[];
  domainPanels: OverviewDomainPanel[];
  alerts: OverviewAlertItem[];
  activities: OverviewActivityItem[];
  quickLinks: OverviewQuickLink[];
  workflowBlocks: OverviewWorkflowBlock[];
  pendingItems: OverviewPendingItem[];
  operationalTimeline: OverviewTimelineItem[];
}

export interface OverviewFilter {
  period: OverviewPeriod;
}
