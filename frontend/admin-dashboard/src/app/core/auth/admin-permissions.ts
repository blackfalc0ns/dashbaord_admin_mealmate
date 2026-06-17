/** Permission keys for F06 admin operations. Backend enforces; UI hides/disables by role. */
export const AdminPermissions = {
  order72hMonitor: 'order-72h:monitor',
  order72hOpenReplacement: 'order-72h:open-replacement',
  order72hManualReassign: 'order-72h:manual-reassign',
  order72hException: 'order-72h:exception',
} as const;

export type AdminPermission =
  (typeof AdminPermissions)[keyof typeof AdminPermissions];
