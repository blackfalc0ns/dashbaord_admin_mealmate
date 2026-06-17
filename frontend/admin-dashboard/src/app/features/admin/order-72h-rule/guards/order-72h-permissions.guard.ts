import { CanActivateFn } from '@angular/router';
import { AdminPermissions } from '../../../../core/auth/admin-permissions';

/** Stub — wire to real auth service when app is bootstrapped. */
export const order72hMonitorGuard: CanActivateFn = () => {
  void AdminPermissions.order72hMonitor;
  return true;
};

export const order72hExceptionGuard: CanActivateFn = () => {
  void AdminPermissions.order72hException;
  return true;
};
