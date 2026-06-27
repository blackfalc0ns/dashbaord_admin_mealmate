export type CapacityStatus = 'active' | 'at_risk' | 'busy_auto' | 'busy_manual' | 'suspended';

export interface RestaurantCapacityRow {
  restaurantId: string;
  restaurantName: string;
  areaName: string;
  serviceWindow: string;
  operatingDay: string;
  capacityLimit: number;
  bookedMeals: number;
  confirmedMeals: number;
  pending72h: number;
  blockedMeals: number;
  status: CapacityStatus;
  automationReason: string;
  overrideUntil: string | null;
  ruleVersion: string;
  updatedAt: string;
  sourceReference: string;
}

export interface CapacityAuditEvent {
  id: string;
  restaurantId: string;
  restaurantName: string;
  action: 'Create' | 'Update' | 'Override' | 'Suspend' | 'Release' | 'AutoBusy';
  actorName: string;
  reason: string;
  createdAt: string;
}
