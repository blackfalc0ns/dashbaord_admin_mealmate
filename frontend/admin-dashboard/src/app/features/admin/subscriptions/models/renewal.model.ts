export type RenewalStatus =
  | 'ExpiringSoon'
  | 'ReminderSent'
  | 'InProgress'
  | 'Renewed'
  | 'Lapsed'
  | 'AtRisk';

export type RenewalSubscriptionType = 'Individual' | 'Family';

export type RenewalReminderStage = 'None' | 'First' | 'Second' | 'Final';

export interface RenewalPolicy {
  firstReminderDays: number;
  secondReminderDays: number;
  finalReminderDays: number;
  pricingSnapshotOnRenewal: boolean;
  updatedAt: string;
  updatedByAr: string;
  updatedByEn: string;
}

export interface RenewalRow {
  id: string;
  customerId: string;
  customerNameAr: string;
  customerNameEn: string;
  subscriptionId: string;
  subscriptionType: RenewalSubscriptionType;
  subscriptionTypeAr: string;
  subscriptionTypeEn: string;
  programAr: string;
  programEn: string;
  bundleAr: string;
  bundleEn: string;
  tierAr: string;
  tierEn: string;
  subscriptionDays: number;
  endDateAr: string;
  endDateEn: string;
  daysRemaining: number;
  status: RenewalStatus;
  statusAr: string;
  statusEn: string;
  reminderStage: RenewalReminderStage;
  reminderStageAr: string;
  reminderStageEn: string;
  lastReminderAtAr: string | null;
  lastReminderAtEn: string | null;
  previousPriceKd: number;
  renewalPriceKd: number;
  priceChanged: boolean;
  promoCodeAr: string | null;
  promoCodeEn: string | null;
  walletBalanceKd: number;
  canSendReminder: boolean;
  renewedAtAr: string | null;
  renewedAtEn: string | null;
}

export interface RenewalStats {
  expiringThisWeek: number;
  remindersSent: number;
  inProgress: number;
  renewedThisMonth: number;
  atRisk: number;
}
