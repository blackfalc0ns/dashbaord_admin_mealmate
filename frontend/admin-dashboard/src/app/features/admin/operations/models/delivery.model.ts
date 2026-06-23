export type DeliveryStatus =
  | 'awaiting_pickup'
  | 'picked_up'
  | 'in_transit'
  | 'arriving'
  | 'delivered'
  | 'failed';

export type HoldCaseStatus = 'active' | 'contact_pending' | 'resolved';

export interface DeliveryTrackingRow {
  orderId: string;
  customerDisplayName: string;
  restaurantName: string;
  driverName: string;
  driverPhone: string;
  deliveryDate: string;
  status: DeliveryStatus;
  etaMinutes: number | null;
  lastScanAt: string | null;
  areaName: string;
  distanceKm: number;
  barcodeScannedPickup: boolean;
  barcodeScannedDelivery: boolean;
}

export interface HoldCaseRow {
  caseId: string;
  orderId: string;
  customerDisplayName: string;
  driverName: string;
  restaurantName: string;
  holdReason: string;
  holdStartedAt: string;
  contactAttempts: number;
  lastContactAt: string | null;
  status: HoldCaseStatus;
  areaName: string;
}
