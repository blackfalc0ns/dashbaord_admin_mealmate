export type DurationStatus = 'active' | 'inactive';

export interface SubscriptionDuration {
  id: string;
  nameAr: string;
  nameEn: string;
  days: number;
  isCustom: boolean;
  status: DurationStatus;
  commissionAtDays: number;
  createdAt: string;
  updatedAt: string;
}
