import { OrderExceptionType } from './order-72h.enums';

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
