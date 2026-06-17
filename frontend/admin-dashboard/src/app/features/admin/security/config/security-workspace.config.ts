import type { SecurityAdminPageId } from '../data/security-admin-pages.data';

export type SecurityWorkspaceTab = 'overview' | 'access' | 'users';
export type SecurityAccessPanel = 'roles' | 'matrix' | 'scopes';
export type SecurityUsersPanel = 'directory' | 'invites';

export interface SecurityWorkspaceTabDefinition {
  id: SecurityWorkspaceTab;
  labelAr: string;
  labelEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: string;
  badge?: number;
}

export interface SecurityAccessPanelDefinition {
  id: SecurityAccessPanel;
  labelAr: string;
  labelEn: string;
  descriptionAr: string;
  descriptionEn: string;
  pageId: SecurityAdminPageId;
}

export interface SecurityUsersPanelDefinition {
  id: SecurityUsersPanel;
  labelAr: string;
  labelEn: string;
  descriptionAr: string;
  descriptionEn: string;
  pageId: SecurityAdminPageId;
}

export interface SecurityWorkspaceContext {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  sectionAr: string;
  sectionEn: string;
  actionAr: string;
  actionEn: string;
  pendingReview: number;
}

export const DEFAULT_SECURITY_TAB: SecurityWorkspaceTab = 'overview';
export const DEFAULT_ACCESS_PANEL: SecurityAccessPanel = 'roles';
export const DEFAULT_USERS_PANEL: SecurityUsersPanel = 'directory';

export const SECURITY_WORKSPACE_TABS: SecurityWorkspaceTabDefinition[] = [
  {
    id: 'overview',
    labelAr: 'نظرة عامة',
    labelEn: 'Overview',
    descriptionAr: 'مؤشرات الأمان والانتقال السريع',
    descriptionEn: 'Security posture and quick navigation',
    icon: 'lucideLayoutDashboard',
  },
  {
    id: 'access',
    labelAr: 'الأدوار والصلاحيات',
    labelEn: 'Roles & access',
    descriptionAr: 'الأدوار والمصفوفة والنطاقات الحساسة',
    descriptionEn: 'Roles, permission matrix, and sensitive scopes',
    icon: 'lucideShield',
    badge: 4,
  },
  {
    id: 'users',
    labelAr: 'المستخدمون والدعوات',
    labelEn: 'Users & invites',
    descriptionAr: 'دليل الحسابات والدعوات وسجل النشاط',
    descriptionEn: 'Account directory, invites, and activity log',
    icon: 'lucideUsers',
    badge: 48,
  },
];

export const SECURITY_ACCESS_PANELS: SecurityAccessPanelDefinition[] = [
  {
    id: 'roles',
    labelAr: 'الأدوار',
    labelEn: 'Roles',
    descriptionAr: 'قائمة الأدوار المحمية والنشطة',
    descriptionEn: 'Protected and active role catalog',
    pageId: 'roles',
  },
  {
    id: 'matrix',
    labelAr: 'مصفوفة الصلاحيات',
    labelEn: 'Permission matrix',
    descriptionAr: 'صلاحيات كل دور حسب الوحدة',
    descriptionEn: 'Module permissions by role',
    pageId: 'roleMatrix',
  },
  {
    id: 'scopes',
    labelAr: 'النطاقات والحساسة',
    labelEn: 'Scopes & sensitive',
    descriptionAr: '2FA والموافقات والأفعال الحساسة',
    descriptionEn: '2FA, approvals, and sensitive actions',
    pageId: 'roleScopes',
  },
];

export const SECURITY_USERS_PANELS: SecurityUsersPanelDefinition[] = [
  {
    id: 'directory',
    labelAr: 'دليل المستخدمين',
    labelEn: 'User directory',
    descriptionAr: 'عملاء ومطاعم وسائقون وإداريون',
    descriptionEn: 'Customers, restaurants, drivers, and admins',
    pageId: 'users',
  },
  {
    id: 'invites',
    labelAr: 'الدعوات والنشاط',
    labelEn: 'Invites & activity',
    descriptionAr: 'دعوات معلقة وسجل تدقيق مختصر',
    descriptionEn: 'Pending invites and audit trail preview',
    pageId: 'userInvites',
  },
];

const LEGACY_ROUTE_MAP: Record<string, { tab: SecurityWorkspaceTab; panel?: string }> = {
  '/admin/security/roles': { tab: 'access', panel: 'roles' },
  '/admin/security/roles/matrix': { tab: 'access', panel: 'matrix' },
  '/admin/security/roles/scopes': { tab: 'access', panel: 'scopes' },
  '/admin/security/users': { tab: 'users', panel: 'directory' },
  '/admin/security/users/invitations': { tab: 'users', panel: 'invites' },
};

export function isSecurityWorkspaceTab(value: string | null | undefined): value is SecurityWorkspaceTab {
  return SECURITY_WORKSPACE_TABS.some((tab) => tab.id === value);
}

export function isSecurityAccessPanel(value: string | null | undefined): value is SecurityAccessPanel {
  return SECURITY_ACCESS_PANELS.some((panel) => panel.id === value);
}

export function isSecurityUsersPanel(value: string | null | undefined): value is SecurityUsersPanel {
  return SECURITY_USERS_PANELS.some((panel) => panel.id === value);
}

export function resolveSecurityPageId(
  tab: SecurityWorkspaceTab,
  accessPanel: SecurityAccessPanel,
  usersPanel: SecurityUsersPanel,
): SecurityAdminPageId | null {
  if (tab === 'overview') {
    return null;
  }

  if (tab === 'access') {
    return SECURITY_ACCESS_PANELS.find((panel) => panel.id === accessPanel)?.pageId ?? 'roles';
  }

  return SECURITY_USERS_PANELS.find((panel) => panel.id === usersPanel)?.pageId ?? 'users';
}

export function legacySecurityRoute(path: string): { tab: SecurityWorkspaceTab; panel: string } | null {
  const match = LEGACY_ROUTE_MAP[path];
  if (!match?.panel) {
    return match ? { tab: match.tab, panel: match.tab === 'access' ? DEFAULT_ACCESS_PANEL : DEFAULT_USERS_PANEL } : null;
  }

  return { tab: match.tab, panel: match.panel };
}

export function resolveSecurityContext(
  tab: SecurityWorkspaceTab,
  accessPanel: SecurityAccessPanel,
  usersPanel: SecurityUsersPanel,
): SecurityWorkspaceContext {
  const overviewTab = SECURITY_WORKSPACE_TABS.find((item) => item.id === 'overview')!;
  const accessTab = SECURITY_WORKSPACE_TABS.find((item) => item.id === 'access')!;
  const usersTab = SECURITY_WORKSPACE_TABS.find((item) => item.id === 'users')!;

  if (tab === 'overview') {
    return {
      titleAr: 'الأمان والصلاحيات',
      titleEn: 'Security & access',
      descriptionAr: overviewTab.descriptionAr,
      descriptionEn: overviewTab.descriptionEn,
      sectionAr: overviewTab.labelAr,
      sectionEn: overviewTab.labelEn,
      actionAr: 'مراجعة التنبيهات',
      actionEn: 'Review alerts',
      pendingReview: 48,
    };
  }

  if (tab === 'access') {
    const panel = SECURITY_ACCESS_PANELS.find((item) => item.id === accessPanel) ?? SECURITY_ACCESS_PANELS[0];

    return {
      titleAr: panel.labelAr,
      titleEn: panel.labelEn,
      descriptionAr: panel.descriptionAr,
      descriptionEn: panel.descriptionEn,
      sectionAr: `${accessTab.labelAr} · ${panel.labelAr}`,
      sectionEn: `${accessTab.labelEn} · ${panel.labelEn}`,
      actionAr: accessPanel === 'roles' ? 'إنشاء دور' : accessPanel === 'matrix' ? 'تصدير المصفوفة' : 'إضافة نطاق',
      actionEn: accessPanel === 'roles' ? 'Create role' : accessPanel === 'matrix' ? 'Export matrix' : 'Add scope',
      pendingReview: 4,
    };
  }

  const panel = SECURITY_USERS_PANELS.find((item) => item.id === usersPanel) ?? SECURITY_USERS_PANELS[0];

  return {
    titleAr: panel.labelAr,
    titleEn: panel.labelEn,
    descriptionAr: panel.descriptionAr,
    descriptionEn: panel.descriptionEn,
    sectionAr: `${usersTab.labelAr} · ${panel.labelAr}`,
    sectionEn: `${usersTab.labelEn} · ${panel.labelEn}`,
    actionAr: usersPanel === 'directory' ? 'دعوة مستخدم' : 'إرسال دعوة',
    actionEn: usersPanel === 'directory' ? 'Invite user' : 'Send invite',
    pendingReview: 48,
  };
}
