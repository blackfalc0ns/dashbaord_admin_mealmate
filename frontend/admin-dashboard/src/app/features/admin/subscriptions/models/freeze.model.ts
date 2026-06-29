export type FreezeRequestStatus =
  | 'PendingStart'
  | 'Active'
  | 'EndingSoon'
  | 'Completed';

export type FreezeSubscriptionType = 'Individual' | 'Family';

export interface FreezePolicy {
  defaultDurationDays: number;
  startDelayDays: number;
  extendSubscriptionEnd: boolean;
  updatedAt: string;
  updatedByAr: string;
  updatedByEn: string;
}

export interface FreezeRequestRow {
  id: string;
  customerId: string;
  customerNameAr: string;
  customerNameEn: string;
  subscriptionId: string;
  subscriptionType: FreezeSubscriptionType;
  subscriptionTypeAr: string;
  subscriptionTypeEn: string;
  programAr: string;
  programEn: string;
  bundleAr: string;
  bundleEn: string;
  tierAr: string;
  tierEn: string;
  requestedAt: string;
  requestedAtAr: string;
  requestedAtEn: string;
  freezeStartDateAr: string;
  freezeStartDateEn: string;
  freezeEndDateAr: string;
  freezeEndDateEn: string;
  durationDays: number;
  daysAddedToSubscription: number;
  remainingSubscriptionDays: number;
  status: FreezeRequestStatus;
  statusAr: string;
  statusEn: string;
  has72hConflict: boolean;
  conflictNoteAr?: string;
  conflictNoteEn?: string;
  canEndEarly: boolean;
}

export interface FreezeStats {
  currentlyFrozen: number;
  pendingStart: number;
  endingSoon: number;
  requestsThisMonth: number;
}
