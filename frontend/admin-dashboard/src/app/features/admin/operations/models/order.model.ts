import {
  OrderLifecyclePhase,
  ReplacementWindowStatus,
  RestaurantConfirmationStatus,
} from './order-lifecycle.enums';
import { OrderExceptionType } from './order-lifecycle.enums';

export interface AdminOrderRow {
  orderId: string;
  customerId: string;
  customerDisplayName: string;
  restaurantId: string;
  restaurantName: string;
  deliveryDate: string;
  hoursUntilDelivery: number;
  phase: OrderLifecyclePhase;
  confirmationStatus: RestaurantConfirmationStatus;
  confirmationDeadlineAt: string | null;
  replacementWindowStatus: ReplacementWindowStatus;
  isCustomerEditLocked: boolean;
  countryCode: string;
  programName: string;
  bundleName: string;
  tierName: string;
  mealName: string;
}

export interface OrderOperationalExtras {
  subscriptionId: string;
  subscriptionDayIndex: number;
  subscriptionDayTotal: number;
  customerPhone: string;
  deliveryArea: string;
  deliveryAddressMasked: string;
  restaurantPhone: string;
  restaurantContactName: string;
  lockedAt: string | null;
  dispatchedToRestaurantAt: string | null;
  allergens: string;
  dietaryNotes: string;
  escalationNotes: string | null;
  restaurantContactAttempts: number;
  alternativeRestaurantCount: number;
  mealCalories: number;
  autoSelected: boolean;
}

export interface AdminOrderDetail extends AdminOrderRow {
  barcodeGenerated: boolean;
  invoiceGenerated: boolean;
  driverAssigned: boolean;
  driverName: string | null;
  replacementHoursRemaining: number | null;
  extras: OrderOperationalExtras;
}

export interface ReplacementWindowRow {
  orderId: string;
  customerDisplayName: string;
  originalRestaurantName: string;
  windowOpensAt: string;
  windowClosesAt: string;
  status: ReplacementWindowStatus;
  hoursRemaining: number;
}

export interface OrderExceptionLog {
  id: string;
  orderId: string;
  customerDisplayName: string;
  restaurantName: string;
  deliveryDate: string;
  exceptionType: OrderExceptionType;
  reason: string;
  actorName: string;
  appliedAt: string;
}

export interface OrderTimelineEvent {
  id: string;
  labelAr: string;
  labelEn: string;
  at: string | null;
  status: 'done' | 'active' | 'pending' | 'overdue';
}
