import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminAuthStore } from './admin-auth.store';
import { AdminPermission, AdminPermissions } from './admin-permissions';

/**
 * Route guard — checks RBAC permissions from AdminAuthStore.
 * Without a session, allows access (stub/dev parity with prior guards).
 */
export function adminPermissionGuard(
  required: AdminPermission | AdminPermission[],
): CanActivateFn {
  const permissions = Array.isArray(required) ? required : [required];

  return () => {
    const auth = inject(AdminAuthStore);
    const router = inject(Router);

    if (!auth.isAuthenticated()) {
      return true;
    }

    if (auth.hasAllPermissions(...permissions)) {
      return true;
    }

    return router.createUrlTree(['/admin/forbidden']);
  };
}

export const order72hMonitorGuard = adminPermissionGuard(
  AdminPermissions.order72hMonitor,
);

export const order72hExceptionGuard = adminPermissionGuard(
  AdminPermissions.order72hException,
);
