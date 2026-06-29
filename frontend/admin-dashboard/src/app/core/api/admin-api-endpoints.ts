/** Admin API paths — aligned with blueprint `/api/v1/...` contract. */
export const AdminApiEndpoints = {
  dashboardOverview: '/api/v1/admin/dashboard/overview',
  confirmationOverdue: '/api/v1/admin/orders/confirmation-overdue',
  openReplacementWindow: (orderId: string) =>
    `/api/v1/admin/orders/${orderId}/open-replacement-window`,
  manualReassign: (orderId: string) =>
    `/api/v1/admin/orders/${orderId}/manual-reassign`,
  orderException: (orderId: string) => `/api/v1/admin/orders/${orderId}/exception`,
  documentTemplates: '/api/v1/admin/operations/document-templates',
  orderInvoice: (orderId: string) => `/api/v1/admin/operations/orders/${orderId}/invoice`,
  orderLabels: (orderId: string) => `/api/v1/admin/operations/orders/${orderId}/labels`,
  menuApprovals: '/api/v1/admin/operations/menu-approvals',
  menuApproval: (id: string) => `/api/v1/admin/operations/menu-approvals/${id}`,
  menuApprovalAction: (id: string, action: string) =>
    `/api/v1/admin/operations/menu-approvals/${id}/actions/${action}`,
} as const;
