import {
  Order72hPhase,
  ReplacementWindowStatus,
  RestaurantConfirmationStatus,
} from './order-72h.enums';

/** Row model for admin 72h monitoring tables. */
export interface AdminOrder72hRow {
  orderId: string;
  customerId: string;
  customerDisplayName: string;
  restaurantId: string;
  restaurantName: string;
  deliveryDate: string;
  hoursUntilDelivery: number;
  phase: Order72hPhase;
  confirmationStatus: RestaurantConfirmationStatus;
  confirmationDeadlineAt: string | null;
  replacementWindowStatus: ReplacementWindowStatus;
  isCustomerEditLocked: boolean;
  countryCode: string;
}

/** Filter for confirmation-overdue and monitor lists. */
export interface ConfirmationOverdueFilter {
  countryCode?: string;
  restaurantId?: string;
  deliveryDateFrom?: string;
  deliveryDateTo?: string;
  phase?: Order72hPhase;
  confirmationStatus?: RestaurantConfirmationStatus;
  page: number;
  pageSize: number;
}

export interface PaginatedAdminOrder72hResponse {
  items: AdminOrder72hRow[];
  totalCount: number;
  page: number;
  pageSize: number;
}
