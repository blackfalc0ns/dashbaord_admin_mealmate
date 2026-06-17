import { OrderExceptionType } from './order-72h.enums';

/** Request to open 24h customer replacement window after restaurant non-confirmation. */
export interface OpenReplacementWindowRequest {
  reason: string;
  notifyCustomer: boolean;
}

export interface OpenReplacementWindowResponse {
  orderId: string;
  windowOpensAt: string;
  windowClosesAt: string;
}

/** Admin manual restaurant reassignment. */
export interface ManualReassignRequest {
  targetRestaurantId: string;
  reason: string;
}

/** Emergency admin exception (WhatsApp → panel), fully audited. */
export interface OrderExceptionRequest {
  exceptionType: OrderExceptionType;
  reason: string;
  newRestaurantId?: string;
  newMealId?: string;
  actorNote?: string;
}

export interface OrderExceptionResponse {
  orderId: string;
  auditLogId: string;
  appliedAt: string;
}
