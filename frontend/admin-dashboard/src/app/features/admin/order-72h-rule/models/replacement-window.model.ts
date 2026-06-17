import { ReplacementWindowStatus } from './order-72h.enums';

export interface ReplacementWindowRow {
  orderId: string;
  customerDisplayName: string;
  originalRestaurantName: string;
  windowOpensAt: string;
  windowClosesAt: string;
  status: ReplacementWindowStatus;
  hoursRemaining: number;
}

export interface ReplacementWindowListResponse {
  items: ReplacementWindowRow[];
  totalCount: number;
}
