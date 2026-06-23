/** Permission keys — backend enforces; UI hides/disables by role and scope. */
export const AdminPermissions = {
  overviewView: 'overview:view',
  accountsView: 'accounts:view',
  accountsApprove: 'accounts:approve',
  subscriptionsView: 'subscriptions:view',
  subscriptionsManage: 'subscriptions:manage',
  subscriptionsPricing: 'subscriptions:pricing',
  operationsView: 'operations:view',
  order72hMonitor: 'order-72h:monitor',
  order72hOpenReplacement: 'order-72h:open-replacement',
  order72hManualReassign: 'order-72h:manual-reassign',
  order72hException: 'order-72h:exception',
  deliveryView: 'delivery:view',
  financeView: 'finance:view',
  supportView: 'support:view',
  securityManage: 'security:manage',
  settingsManage: 'settings:manage',
} as const;

export type AdminPermission =
  (typeof AdminPermissions)[keyof typeof AdminPermissions];

export const ALL_ADMIN_PERMISSIONS: AdminPermission[] = Object.values(AdminPermissions);

/** Permissions granted to super_admin in stub/dev login. */
export const SUPER_ADMIN_PERMISSIONS: ReadonlySet<AdminPermission> = new Set(
  ALL_ADMIN_PERMISSIONS,
);
