/** Row for −24h final preparation monitoring. */
export interface Preparation24hRow {
  orderId: string;
  customerDisplayName: string;
  restaurantId: string;
  restaurantName: string;
  deliveryDate: string;
  hoursUntilDelivery: number;
  mealName: string;
  barcodeGenerated: boolean;
  invoiceGenerated: boolean;
  driverAssigned: boolean;
  driverName: string | null;
  countryCode: string;
}
