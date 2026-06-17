/** Admin API paths — dashboard, F06, and shared operational endpoints. */
export const AdminApiEndpoints = {
  dashboardOverview: '/api/admin/dashboard/overview',
  confirmationOverdue: '/api/admin/orders/confirmation-overdue',
  openReplacementWindow: (orderId: string) =>
    `/api/admin/orders/${orderId}/open-replacement-window`,
  manualReassign: (orderId: string) =>
    `/api/admin/orders/${orderId}/manual-reassign`,
  orderException: (orderId: string) => `/api/admin/orders/${orderId}/exception`,
} as const;
