/** Admin API paths — aligned with blueprint `/api/v1/...` contract. */
export const AdminApiEndpoints = {
  dashboardOverview: '/api/v1/admin/dashboard/overview',
  confirmationOverdue: '/api/v1/admin/orders/confirmation-overdue',
  openReplacementWindow: (orderId: string) =>
    `/api/v1/admin/orders/${orderId}/open-replacement-window`,
  manualReassign: (orderId: string) =>
    `/api/v1/admin/orders/${orderId}/manual-reassign`,
  orderException: (orderId: string) => `/api/v1/admin/orders/${orderId}/exception`,
} as const;
