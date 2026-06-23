import { Injectable, computed, signal } from '@angular/core';
import {
  AdminPermission,
  ALL_ADMIN_PERMISSIONS,
  SUPER_ADMIN_PERMISSIONS,
} from './admin-permissions';

export type AdminRole = 'super_admin' | 'country_admin' | 'ops_admin' | 'finance_admin';

export interface AdminSession {
  accessToken: string;
  expiresAt: string;
  role: AdminRole;
  permissions?: AdminPermission[];
  countryCode?: string | null;
}

@Injectable({ providedIn: 'root' })
export class AdminAuthStore {
  readonly accessToken = signal<string | null>(null);
  readonly expiresAt = signal<string | null>(null);
  readonly role = signal<AdminRole | null>(null);
  readonly countryCode = signal<string | null>(null);
  private readonly permissionSet = signal<ReadonlySet<AdminPermission>>(new Set());

  readonly permissions = computed(() => [...this.permissionSet()]);

  readonly isAuthenticated = computed(() => Boolean(this.accessToken()));

  setSession(session: AdminSession): void {
    this.accessToken.set(session.accessToken);
    this.expiresAt.set(session.expiresAt);
    this.role.set(session.role);
    this.countryCode.set(session.countryCode ?? null);

    const perms =
      session.permissions ??
      (session.role === 'super_admin' ? [...SUPER_ADMIN_PERMISSIONS] : []);
    this.permissionSet.set(new Set(perms));
  }

  clearSession(): void {
    this.accessToken.set(null);
    this.expiresAt.set(null);
    this.role.set(null);
    this.countryCode.set(null);
    this.permissionSet.set(new Set());
  }

  hasPermission(permission: AdminPermission): boolean {
    return this.permissionSet().has(permission);
  }

  hasAnyPermission(...permissions: AdminPermission[]): boolean {
    return permissions.some((p) => this.hasPermission(p));
  }

  hasAllPermissions(...permissions: AdminPermission[]): boolean {
    return permissions.every((p) => this.hasPermission(p));
  }

  /** UI access — allows unauthenticated dev/stub sessions (matches guards & directive). */
  canAccess(permission: AdminPermission): boolean {
    return !this.isAuthenticated() || this.hasPermission(permission);
  }

  canAccessAll(...permissions: AdminPermission[]): boolean {
    return !this.isAuthenticated() || this.hasAllPermissions(...permissions);
  }

  /** Dev helper — grant every permission without login payload. */
  grantAllPermissions(): void {
    this.permissionSet.set(new Set(ALL_ADMIN_PERMISSIONS));
  }
}
