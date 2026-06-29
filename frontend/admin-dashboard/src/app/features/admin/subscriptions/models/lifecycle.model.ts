export type FamilyGroupStatus = 'Active' | 'Frozen' | 'Dispute' | 'PendingDetach';

export type IndividualSubscriptionStatus = 'Active' | 'Frozen' | 'Cancelled' | 'Expiring';

export interface FamilyMemberLifecycle {
  customerId: string;
  nameAr: string;
  nameEn: string;
  role: 'Manager' | 'Member';
  roleAr: string;
  roleEn: string;
  status: 'Active' | 'Pending' | 'Detached';
  statusAr: string;
  statusEn: string;
  quotaDays: number;
  usedDays: number;
  activeOrders: number;
}

export interface FamilyGroupRow {
  id: string;
  nameAr: string;
  nameEn: string;
  managerCustomerId: string;
  managerNameAr: string;
  managerNameEn: string;
  subscriptionId: string;
  programAr: string;
  programEn: string;
  bundleAr: string;
  bundleEn: string;
  tierAr: string;
  tierEn: string;
  memberCount: number;
  subscriptionDays: number;
  usedDays: number;
  activeOrders: number;
  status: FamilyGroupStatus;
  statusAr: string;
  statusEn: string;
  hasEscalation: boolean;
  escalationNoteAr?: string;
  escalationNoteEn?: string;
  members: FamilyMemberLifecycle[];
}

export interface IndividualSubscriptionRow {
  id: string;
  customerId: string;
  customerNameAr: string;
  customerNameEn: string;
  subscriptionId: string;
  programAr: string;
  programEn: string;
  bundleAr: string;
  bundleEn: string;
  tierAr: string;
  tierEn: string;
  areaAr: string;
  areaEn: string;
  subscriptionDays: number;
  usedDays: number;
  status: IndividualSubscriptionStatus;
  statusAr: string;
  statusEn: string;
  startDateAr: string;
  startDateEn: string;
  expiringInDays: number | null;
}

export interface LifecycleStats {
  familyGroups: number;
  familyMembers: number;
  familyDisputes: number;
  familyPendingDetach: number;
  individualActive: number;
  individualFrozen: number;
  individualExpiring: number;
  individualCancelled: number;
}
