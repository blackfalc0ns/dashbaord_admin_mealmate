export type AutoSelectionStatus =
  | 'pending'
  | 'completed'
  | 'fallback'
  | 'quota_override'
  | 'failed';

export type AutoSelectionSource = 'automatic' | 'fallback' | 'manual_override';

export type PipelineStepStatus = 'passed' | 'failed' | 'skipped' | 'pending';

export interface AutoSelectionCandidate {
  restaurantId: string;
  restaurantName: string;
  reason: string;
  rejected: boolean;
}

export interface AutoSelectionPipelineStep {
  key: string;
  labelAr: string;
  labelEn: string;
  status: PipelineStepStatus;
  detail: string;
}

export interface AutoSelectionDistributionRow {
  restaurantId: string;
  restaurantName: string;
  autoSelectedCount: number;
  manualCount: number;
  sharePercent: number;
  tier: 'basic' | 'platinum' | 'elite';
}

export interface AutoSelectionAlert {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  titleAr: string;
  titleEn: string;
  detailAr: string;
  detailEn: string;
  createdAt: string;
}

export interface AutoSelectionRow {
  id: string;
  customerId: string;
  customerDisplayName: string;
  subscriptionId: string;
  programName: string;
  bundleName: string;
  areaName: string;
  deliveryDate: string;
  dayNumber: number;
  tier: 'basic' | 'platinum' | 'elite';
  subscriptionDays: number;
  availableRestaurants: number;
  repetitionLimit: number;
  restaurantUses: number;
  selectedRestaurantId: string;
  selectedRestaurantName: string;
  selectedMealName: string;
  status: AutoSelectionStatus;
  source: AutoSelectionSource;
  allergiesRespected: boolean;
  dislikesRespected: boolean;
  capacityAvailable: boolean;
  hoursUntilLock: number | null;
  lockAt: string | null;
  fallbackReason: string | null;
  selectionReason: string;
  allergies: string[];
  dislikes: string[];
  rejectedCandidates: AutoSelectionCandidate[];
  pipeline: AutoSelectionPipelineStep[];
  notificationSent: boolean;
  correlationId: string;
  ruleVersion: string;
  updatedAt: string;
}

export interface AutoSelectionAuditEvent {
  id: string;
  selectionId: string;
  action: 'AutoSelect' | 'Fallback' | 'QuotaOverride' | 'ManualOverride' | 'Failed';
  actorName: string;
  reason: string;
  createdAt: string;
}

export interface AutoSelectionRuleConfig {
  enabled: boolean;
  triggerHoursBeforeDelivery: number;
  limitFormula: string;
  minLimit: number;
  priorityOrder: string[];
  fallbackEnabled: boolean;
  busyQuotaOverrideEnabled: boolean;
  ruleVersion: string;
  updatedAt: string;
}
