export type SecurityAdminPageId =
  | 'roles'
  | 'roleMatrix'
  | 'roleScopes'
  | 'users'
  | 'userInvites';

export type SecurityTone = 'berry' | 'green' | 'warm' | 'red' | 'blue' | 'slate';

export interface SecurityStat {
  labelAr: string;
  labelEn: string;
  value: string;
  helperAr: string;
  helperEn: string;
  tone: SecurityTone;
}

export interface SecurityAction {
  labelAr: string;
  labelEn: string;
}

export interface SecurityPanelItem {
  titleAr: string;
  titleEn: string;
  metaAr: string;
  metaEn: string;
  descriptionAr: string;
  descriptionEn: string;
  tone: SecurityTone;
  valueAr?: string;
  valueEn?: string;
  filterKey?: string;
}

export interface SecurityTableColumn {
  key: string;
  labelAr: string;
  labelEn: string;
}

export interface SecurityTableRow {
  id: string;
  tone: SecurityTone;
  cellsAr: Record<string, string>;
  cellsEn: Record<string, string>;
  filterKey?: string;
}

export interface SecurityNavLink {
  labelAr: string;
  labelEn: string;
  route: string;
  descriptionAr: string;
  descriptionEn: string;
  tone: SecurityTone;
}

export interface SecurityAdminPage {
  id: SecurityAdminPageId;
  route: string;
  pageNo: string;
  eyebrowAr: string;
  eyebrowEn: string;
  titleAr: string;
  titleEn: string;
  goalAr: string;
  goalEn: string;
  roleChipAr: string;
  roleChipEn: string;
  scopeChipAr: string;
  scopeChipEn: string;
  primaryActionAr: string;
  primaryActionEn: string;
  actions: SecurityAction[];
  stats: SecurityStat[];
  leadPanelTitleAr: string;
  leadPanelTitleEn: string;
  leadPanelDescriptionAr: string;
  leadPanelDescriptionEn: string;
  leadItems: SecurityPanelItem[];
  sidePanelTitleAr: string;
  sidePanelTitleEn: string;
  sidePanelDescriptionAr: string;
  sidePanelDescriptionEn: string;
  sideItems: SecurityPanelItem[];
  tableTitleAr: string;
  tableTitleEn: string;
  tableDescriptionAr: string;
  tableDescriptionEn: string;
  columns: SecurityTableColumn[];
  rows: SecurityTableRow[];
  drawerTitleAr: string;
  drawerTitleEn: string;
  drawerDescriptionAr: string;
  drawerDescriptionEn: string;
  drawerFields: SecurityPanelItem[];
}

export function securityLocaleText(isRtl: boolean, ar: string, en: string): string {
  return isRtl ? ar : en;
}

export function securityRowCells(row: SecurityTableRow, isRtl: boolean): Record<string, string> {
  return isRtl ? row.cellsAr : row.cellsEn;
}

export const SECURITY_NAV_LINKS: SecurityNavLink[] = [
  {
    labelAr: 'الأدوار',
    labelEn: 'Roles',
    route: '/admin/security/roles',
    descriptionAr: 'قائمة الأدوار المحمية والنشطة',
    descriptionEn: 'Protected and active roles list',
    tone: 'berry',
  },
  {
    labelAr: 'مصفوفة الصلاحيات',
    labelEn: 'Permission matrix',
    route: '/admin/security/roles/matrix',
    descriptionAr: 'الصلاحيات حسب الوحدة والدور',
    descriptionEn: 'Permissions by module and role',
    tone: 'blue',
  },
  {
    labelAr: 'النطاقات والأفعال الحساسة',
    labelEn: 'Scopes & sensitive actions',
    route: '/admin/security/roles/scopes',
    descriptionAr: '2FA وapproval وaudit preview',
    descriptionEn: '2FA, approval, and audit preview',
    tone: 'warm',
  },
  {
    labelAr: 'كل المستخدمين',
    labelEn: 'All users',
    route: '/admin/security/users',
    descriptionAr: 'عملاء ومطاعم وسائقون وأدمن',
    descriptionEn: 'Customers, restaurants, drivers, and admins',
    tone: 'green',
  },
  {
    labelAr: 'الدعوات والنشاط',
    labelEn: 'Invites & activity',
    route: '/admin/security/users/invitations',
    descriptionAr: 'دعوات معلقة وسجل نشاط مختصر',
    descriptionEn: 'Pending invites and activity log preview',
    tone: 'slate',
  },
];

export const SECURITY_ADMIN_PAGES: Record<SecurityAdminPageId, SecurityAdminPage> = {
  roles: {
    id: 'roles',
    route: '/admin/security/roles',
    pageNo: '05A',
    eyebrowAr: 'الدخول والصلاحيات',
    eyebrowEn: 'Access & permissions',
    titleAr: 'الأدوار',
    titleEn: 'Roles',
    goalAr: 'إدارة قائمة الأدوار الأساسية بدون ازدحام تفاصيل المصفوفة والنطاقات.',
    goalEn: 'Manage core roles without crowding matrix and scope details.',
    roleChipAr: 'Super Admin / Security Admin',
    roleChipEn: 'Super Admin / Security Admin',
    scopeChipAr: 'Global security scope',
    scopeChipEn: 'Global security scope',
    primaryActionAr: 'إنشاء دور',
    primaryActionEn: 'Create role',
    actions: [
      { labelAr: 'نسخ دور', labelEn: 'Duplicate role' },
      { labelAr: 'إلغاء تفعيل', labelEn: 'Deactivate' },
      { labelAr: 'فتح Audit', labelEn: 'Open audit' },
    ],
    stats: [
      { labelAr: 'الأدوار النشطة', labelEn: 'Active roles', value: '14', helperAr: '3 أدوار محمية', helperEn: '3 protected roles', tone: 'berry' },
      { labelAr: 'أدوار محمية', labelEn: 'Protected roles', value: '3', helperAr: 'لا تحذف مباشرة', helperEn: 'Cannot delete directly', tone: 'red' },
      { labelAr: 'مستخدمون مرتبطون', labelEn: 'Linked users', value: '68', helperAr: 'داخل لوحة الأدمن', helperEn: 'In admin panel', tone: 'green' },
    ],
    leadPanelTitleAr: 'قائمة الأدوار',
    leadPanelTitleEn: 'Roles list',
    leadPanelDescriptionAr: 'قائمة مختصرة للأدوار مع حالة الحماية وعدد المستخدمين.',
    leadPanelDescriptionEn: 'Short roles list with protection status and user count.',
    leadItems: [
      {
        titleAr: 'Super Admin',
        titleEn: 'Super Admin',
        metaAr: 'محمي',
        metaEn: 'Protected',
        descriptionAr: 'وصول كامل ولا يمكن إزالة آخر مستخدم منه.',
        descriptionEn: 'Full access; last user cannot be removed.',
        tone: 'red',
        valueAr: '3 مستخدمين',
        valueEn: '3 users',
      },
      {
        titleAr: 'Country Admin',
        titleEn: 'Country Admin',
        metaAr: 'Country scope',
        metaEn: 'Country scope',
        descriptionAr: 'إدارة العمليات والحسابات داخل دولة أو منطقة محددة.',
        descriptionEn: 'Manage operations and accounts within a country or region.',
        tone: 'green',
        valueAr: '12 مستخدم',
        valueEn: '12 users',
      },
      {
        titleAr: 'Operations',
        titleEn: 'Operations',
        metaAr: 'Ops only',
        metaEn: 'Ops only',
        descriptionAr: 'متابعة الطلبات والتنبيهات بدون اعتماد مالي.',
        descriptionEn: 'Track orders and alerts without financial approval.',
        tone: 'blue',
        valueAr: '28 مستخدم',
        valueEn: '28 users',
      },
    ],
    sidePanelTitleAr: 'قواعد حماية الدور',
    sidePanelTitleEn: 'Role protection rules',
    sidePanelDescriptionAr: 'القواعد التي تمنع أخطاء حذف أو تعطيل الأدوار الحساسة.',
    sidePanelDescriptionEn: 'Rules that prevent accidental deletion or deactivation of sensitive roles.',
    sideItems: [
      {
        titleAr: 'Cannot remove last Super Admin',
        titleEn: 'Cannot remove last Super Admin',
        metaAr: 'مفعل',
        metaEn: 'Enabled',
        descriptionAr: 'النظام يمنع الحذف أو تغيير الدور إذا كان آخر Super Admin.',
        descriptionEn: 'System blocks deletion or role change if this is the last Super Admin.',
        tone: 'red',
      },
      {
        titleAr: 'Protected role',
        titleEn: 'Protected role',
        metaAr: 'يتطلب موافقة',
        metaEn: 'Approval required',
        descriptionAr: 'الأدوار المحمية تحتاج موافقة Security Admin آخر.',
        descriptionEn: 'Protected roles require another Security Admin approval.',
        tone: 'warm',
      },
    ],
    tableTitleAr: 'جدول الأدوار',
    tableTitleEn: 'Roles table',
    tableDescriptionAr: 'الصفحة مخصصة لقائمة الأدوار فقط، وباقي التفاصيل في صفحات فرعية.',
    tableDescriptionEn: 'This page lists roles only; details live in sub-pages.',
    columns: [
      { key: 'role', labelAr: 'الدور', labelEn: 'Role' },
      { key: 'modules', labelAr: 'الوحدات', labelEn: 'Modules' },
      { key: 'scopes', labelAr: 'النطاق', labelEn: 'Scope' },
      { key: 'users', labelAr: 'المستخدمون', labelEn: 'Users' },
      { key: 'updated', labelAr: 'آخر تحديث', labelEn: 'Last updated' },
    ],
    rows: [
      {
        id: 'super-admin',
        tone: 'red',
        cellsAr: { role: 'Super Admin', modules: 'كل الوحدات', scopes: 'Global', users: '3', updated: 'اليوم 10:42' },
        cellsEn: { role: 'Super Admin', modules: 'All modules', scopes: 'Global', users: '3', updated: 'Today 10:42' },
      },
      {
        id: 'country-admin',
        tone: 'green',
        cellsAr: { role: 'Country Admin', modules: 'Accounts / Ops / Support', scopes: 'Country + Region', users: '12', updated: 'أمس' },
        cellsEn: { role: 'Country Admin', modules: 'Accounts / Ops / Support', scopes: 'Country + Region', users: '12', updated: 'Yesterday' },
      },
      {
        id: 'finance-viewer',
        tone: 'blue',
        cellsAr: { role: 'Finance Viewer', modules: 'Finance / Reports', scopes: 'Read only', users: '9', updated: 'قبل 6 أيام' },
        cellsEn: { role: 'Finance Viewer', modules: 'Finance / Reports', scopes: 'Read only', users: '9', updated: '6 days ago' },
      },
    ],
    drawerTitleAr: 'تفاصيل دور Country Admin',
    drawerTitleEn: 'Country Admin role details',
    drawerDescriptionAr: 'عرض جانبي مختصر للتفاصيل الأساسية قبل الدخول للمصفوفة.',
    drawerDescriptionEn: 'Brief side view of core details before opening the matrix.',
    drawerFields: [
      {
        titleAr: 'الحالة',
        titleEn: 'Status',
        metaAr: 'نشط',
        metaEn: 'Active',
        descriptionAr: 'الدور يعمل داخل نطاقات الدولة والمنطقة فقط.',
        descriptionEn: 'Role works within country and region scopes only.',
        tone: 'green',
      },
      {
        titleAr: 'الحماية',
        titleEn: 'Protection',
        metaAr: 'غير محمي',
        metaEn: 'Not protected',
        descriptionAr: 'يمكن تعطيله بعد نقل المستخدمين المرتبطين.',
        descriptionEn: 'Can be deactivated after moving linked users.',
        tone: 'warm',
      },
    ],
  },
  roleMatrix: {
    id: 'roleMatrix',
    route: '/admin/security/roles/matrix',
    pageNo: '05B',
    eyebrowAr: 'RBAC',
    eyebrowEn: 'RBAC',
    titleAr: 'مصفوفة الصلاحيات',
    titleEn: 'Permission matrix',
    goalAr: 'فصل تعديل الصلاحيات حسب الوحدة والدور حتى لا تتكدس داخل صفحة الأدوار.',
    goalEn: 'Separate permission edits by module and role instead of crowding the roles page.',
    roleChipAr: 'Security Admin',
    roleChipEn: 'Security Admin',
    scopeChipAr: 'Backend enforced',
    scopeChipEn: 'Backend enforced',
    primaryActionAr: 'حفظ المصفوفة',
    primaryActionEn: 'Save matrix',
    actions: [
      { labelAr: 'تعديل', labelEn: 'Edit' },
      { labelAr: 'مقارنة بدور', labelEn: 'Compare role' },
      { labelAr: 'تصدير Preview', labelEn: 'Export preview' },
    ],
    stats: [
      { labelAr: 'الصلاحيات', labelEn: 'Permissions', value: '126', helperAr: 'عبر 9 وحدات', helperEn: 'Across 9 modules', tone: 'blue' },
      { labelAr: 'تغييرات معلقة', labelEn: 'Pending changes', value: '4', helperAr: 'تحتاج مراجعة', helperEn: 'Needs review', tone: 'warm' },
      { labelAr: 'صلاحيات حساسة', labelEn: 'Sensitive permissions', value: '22', helperAr: 'Audit إلزامي', helperEn: 'Mandatory audit', tone: 'red' },
    ],
    leadPanelTitleAr: 'الوحدات الأساسية',
    leadPanelTitleEn: 'Core modules',
    leadPanelDescriptionAr: 'كل وحدة تظهر كمجموعة مستقلة لتسهيل القراءة والحفظ الجزئي.',
    leadPanelDescriptionEn: 'Each module appears as an independent group for easier reading and partial saves.',
    leadItems: [
      { titleAr: 'Accounts', titleEn: 'Accounts', metaAr: 'View / Approve / Suspend', metaEn: 'View / Approve / Suspend', descriptionAr: 'إدارة اعتماد المطاعم والسائقين.', descriptionEn: 'Manage restaurant and driver approvals.', tone: 'green', valueAr: '18', valueEn: '18' },
      { titleAr: 'Operations', titleEn: 'Operations', metaAr: 'Orders / Alerts / Exceptions', metaEn: 'Orders / Alerts / Exceptions', descriptionAr: 'تشغيل الطلبات وقاعدة 72 ساعة.', descriptionEn: 'Run orders and the 72-hour rule.', tone: 'blue', valueAr: '24', valueEn: '24' },
      { titleAr: 'Finance', titleEn: 'Finance', metaAr: 'Reports / Refunds / Settlements', metaEn: 'Reports / Refunds / Settlements', descriptionAr: 'صلاحيات القراءة والاعتماد المالي.', descriptionEn: 'Financial read and approval permissions.', tone: 'red', valueAr: '16', valueEn: '16' },
      { titleAr: 'Security', titleEn: 'Security', metaAr: 'Roles / Users / Audit', metaEn: 'Roles / Users / Audit', descriptionAr: 'إدارة المستخدمين والأدوار وسجل التدقيق.', descriptionEn: 'Manage users, roles, and audit log.', tone: 'warm', valueAr: '12', valueEn: '12' },
    ],
    sidePanelTitleAr: 'Audit preview',
    sidePanelTitleEn: 'Audit preview',
    sidePanelDescriptionAr: 'أي تغيير في المصفوفة يظهر أثره قبل الحفظ.',
    sidePanelDescriptionEn: 'Any matrix change shows its impact before saving.',
    sideItems: [
      { titleAr: 'Finance approve', titleEn: 'Finance approve', metaAr: 'موافقة مطلوبة', metaEn: 'Approval required', descriptionAr: 'إضافة الاعتماد المالي لدور Operations ممنوعة.', descriptionEn: 'Adding finance approval to Operations role is blocked.', tone: 'red' },
      { titleAr: 'Support read', titleEn: 'Support read', metaAr: 'منخفض المخاطر', metaEn: 'Low risk', descriptionAr: 'إتاحة قراءة الشكاوى لدور Country Admin.', descriptionEn: 'Allow complaint read access for Country Admin.', tone: 'green' },
    ],
    tableTitleAr: 'مصفوفة الصلاحيات',
    tableTitleEn: 'Permission matrix',
    tableDescriptionAr: 'جدول مختصر للمصفوفة بدلا من ضغطها داخل صفحة الأدوار.',
    tableDescriptionEn: 'Short matrix table instead of compressing it into the roles page.',
    columns: [
      { key: 'module', labelAr: 'الوحدة', labelEn: 'Module' },
      { key: 'superAdmin', labelAr: 'Super Admin', labelEn: 'Super Admin' },
      { key: 'countryAdmin', labelAr: 'Country Admin', labelEn: 'Country Admin' },
      { key: 'operations', labelAr: 'Operations', labelEn: 'Operations' },
      { key: 'finance', labelAr: 'Finance Viewer', labelEn: 'Finance Viewer' },
    ],
    rows: [
      { id: 'accounts', tone: 'green', cellsAr: { module: 'Accounts', superAdmin: 'Full', countryAdmin: 'Approve', operations: 'View', finance: '-' }, cellsEn: { module: 'Accounts', superAdmin: 'Full', countryAdmin: 'Approve', operations: 'View', finance: '-' } },
      { id: 'orders', tone: 'blue', cellsAr: { module: 'Operations', superAdmin: 'Full', countryAdmin: 'Manage scoped', operations: 'Manage', finance: 'View' }, cellsEn: { module: 'Operations', superAdmin: 'Full', countryAdmin: 'Manage scoped', operations: 'Manage', finance: 'View' } },
      { id: 'refunds', tone: 'red', cellsAr: { module: 'Refunds', superAdmin: 'Approve', countryAdmin: 'Request', operations: '-', finance: 'View' }, cellsEn: { module: 'Refunds', superAdmin: 'Approve', countryAdmin: 'Request', operations: '-', finance: 'View' } },
    ],
    drawerTitleAr: 'تغيير صلاحية Finance approve',
    drawerTitleEn: 'Finance approve permission change',
    drawerDescriptionAr: 'مثال لتفاصيل تغيير حساس داخل المصفوفة.',
    drawerDescriptionEn: 'Example of a sensitive change inside the matrix.',
    drawerFields: [
      { titleAr: 'Risk', titleEn: 'Risk', metaAr: 'High', metaEn: 'High', descriptionAr: 'يسمح باعتماد استردادات مالية.', descriptionEn: 'Allows approving financial refunds.', tone: 'red' },
      { titleAr: 'Approval', titleEn: 'Approval', metaAr: 'Required', metaEn: 'Required', descriptionAr: 'يتطلب موافقة Security Admin آخر.', descriptionEn: 'Requires another Security Admin approval.', tone: 'warm' },
    ],
  },
  roleScopes: {
    id: 'roleScopes',
    route: '/admin/security/roles/scopes',
    pageNo: '05C',
    eyebrowAr: 'Scopes & Sensitive Actions',
    eyebrowEn: 'Scopes & Sensitive Actions',
    titleAr: 'النطاقات والأفعال الحساسة',
    titleEn: 'Scopes & sensitive actions',
    goalAr: 'صفحة مستقلة لإدارة Country/Region scopes و2FA والأفعال التي تحتاج موافقة.',
    goalEn: 'Dedicated page for Country/Region scopes, 2FA, and approval-required actions.',
    roleChipAr: 'Super Admin only',
    roleChipEn: 'Super Admin only',
    scopeChipAr: 'Country / Region selector',
    scopeChipEn: 'Country / Region selector',
    primaryActionAr: 'تحديث النطاق',
    primaryActionEn: 'Update scope',
    actions: [
      { labelAr: 'Require 2FA', labelEn: 'Require 2FA' },
      { labelAr: 'طلب موافقة', labelEn: 'Request approval' },
      { labelAr: 'عرض Audit', labelEn: 'View audit' },
    ],
    stats: [
      { labelAr: 'نطاقات نشطة', labelEn: 'Active scopes', value: '18', helperAr: 'دول ومناطق', helperEn: 'Countries and regions', tone: 'green' },
      { labelAr: 'أفعال حساسة', labelEn: 'Sensitive actions', value: '7', helperAr: 'approval required', helperEn: 'Approval required', tone: 'red' },
      { labelAr: '2FA مطلوب', labelEn: '2FA required', value: '100%', helperAr: 'للأدوار الحساسة', helperEn: 'For sensitive roles', tone: 'warm' },
    ],
    leadPanelTitleAr: 'Scope selector',
    leadPanelTitleEn: 'Scope selector',
    leadPanelDescriptionAr: 'تقسيم النطاقات حسب الدولة والمنطقة بما يتماشى مع workflow الأدمن.',
    leadPanelDescriptionEn: 'Split scopes by country and region aligned with admin workflow.',
    leadItems: [
      { titleAr: 'Egypt', titleEn: 'Egypt', metaAr: 'Country', metaEn: 'Country', descriptionAr: 'نطاق كامل لمدير الدولة.', descriptionEn: 'Full scope for country manager.', tone: 'green', valueAr: '42 مستخدم', valueEn: '42 users' },
      { titleAr: 'Cairo East', titleEn: 'Cairo East', metaAr: 'Region', metaEn: 'Region', descriptionAr: 'نطاق عمليات فرعي للتوصيل والمطاعم.', descriptionEn: 'Sub-region scope for delivery and restaurants.', tone: 'blue', valueAr: '18 مستخدم', valueEn: '18 users' },
      { titleAr: 'Global Finance', titleEn: 'Global Finance', metaAr: 'Read only', metaEn: 'Read only', descriptionAr: 'قراءة تقارير بدون تعديل نطاقات.', descriptionEn: 'Read reports without editing scopes.', tone: 'warm', valueAr: '9 مستخدمين', valueEn: '9 users' },
    ],
    sidePanelTitleAr: 'Sensitive actions',
    sidePanelTitleEn: 'Sensitive actions',
    sidePanelDescriptionAr: 'الأفعال التي يجب تسجيلها وربطها بموافقة.',
    sidePanelDescriptionEn: 'Actions that must be logged and linked to approval.',
    sideItems: [
      { titleAr: 'Approve refund', titleEn: 'Approve refund', metaAr: 'High risk', metaEn: 'High risk', descriptionAr: 'اعتماد الاستردادات المالية.', descriptionEn: 'Approve financial refunds.', tone: 'red' },
      { titleAr: 'Deactivate admin', titleEn: 'Deactivate admin', metaAr: 'Security', metaEn: 'Security', descriptionAr: 'إيقاف مستخدم أدمن.', descriptionEn: 'Suspend an admin user.', tone: 'warm' },
      { titleAr: 'Change commission', titleEn: 'Change commission', metaAr: 'Finance', metaEn: 'Finance', descriptionAr: 'تعديل عمولات المنصة.', descriptionEn: 'Change platform commissions.', tone: 'red' },
    ],
    tableTitleAr: 'النطاقات حسب الدور',
    tableTitleEn: 'Scopes by role',
    tableDescriptionAr: 'التركيز هنا على النطاق والأفعال الحساسة فقط.',
    tableDescriptionEn: 'Focus here on scope and sensitive actions only.',
    columns: [
      { key: 'role', labelAr: 'الدور', labelEn: 'Role' },
      { key: 'scope', labelAr: 'النطاق', labelEn: 'Scope' },
      { key: 'twoFa', labelAr: '2FA', labelEn: '2FA' },
      { key: 'approval', labelAr: 'موافقة', labelEn: 'Approval' },
      { key: 'audit', labelAr: 'Audit', labelEn: 'Audit' },
    ],
    rows: [
      { id: 'country', tone: 'green', cellsAr: { role: 'Country Admin', scope: 'Country + Region', twoFa: 'Required', approval: 'Sensitive only', audit: 'Full' }, cellsEn: { role: 'Country Admin', scope: 'Country + Region', twoFa: 'Required', approval: 'Sensitive only', audit: 'Full' } },
      { id: 'finance', tone: 'red', cellsAr: { role: 'Finance Approver', scope: 'Global finance', twoFa: 'Required', approval: 'Dual', audit: 'Full' }, cellsEn: { role: 'Finance Approver', scope: 'Global finance', twoFa: 'Required', approval: 'Dual', audit: 'Full' } },
      { id: 'ops', tone: 'blue', cellsAr: { role: 'Operations', scope: 'Region', twoFa: 'Required', approval: 'No finance', audit: 'Operational' }, cellsEn: { role: 'Operations', scope: 'Region', twoFa: 'Required', approval: 'No finance', audit: 'Operational' } },
    ],
    drawerTitleAr: 'Approval required',
    drawerTitleEn: 'Approval required',
    drawerDescriptionAr: 'تفاصيل إجراء حساس قبل إرساله للموافقة.',
    drawerDescriptionEn: 'Sensitive action details before sending for approval.',
    drawerFields: [
      { titleAr: 'Action', titleEn: 'Action', metaAr: 'Deactivate role', metaEn: 'Deactivate role', descriptionAr: 'تعطيل دور مرتبط بمستخدمين.', descriptionEn: 'Deactivate a role linked to users.', tone: 'red' },
      { titleAr: 'Next step', titleEn: 'Next step', metaAr: 'Review', metaEn: 'Review', descriptionAr: 'نقل المستخدمين ثم إرسال الموافقة.', descriptionEn: 'Move users then submit approval.', tone: 'warm' },
    ],
  },
  users: {
    id: 'users',
    route: '/admin/security/users',
    pageNo: '06A',
    eyebrowAr: 'إدارة الحسابات',
    eyebrowEn: 'Account management',
    titleAr: 'كل مستخدمي النظام',
    titleEn: 'All system users',
    goalAr: 'عرض موحد لكل الحسابات داخل المنصة: العملاء، المطاعم، السائقون، ومستخدمو لوحة الأدمن مع فلترة سريعة حسب النوع والحالة والنطاق.',
    goalEn: 'Unified view of all platform accounts: customers, restaurants, drivers, and admin users with quick filters by type, status, and scope.',
    roleChipAr: 'Super Admin يرى الكل / Country Admin حسب النطاق',
    roleChipEn: 'Super Admin sees all / Country Admin scoped',
    scopeChipAr: 'Egypt / All regions',
    scopeChipEn: 'Egypt / All regions',
    primaryActionAr: 'إضافة أو دعوة مستخدم',
    primaryActionEn: 'Add or invite user',
    actions: [
      { labelAr: 'تصدير', labelEn: 'Export' },
      { labelAr: 'فلترة', labelEn: 'Filter' },
      { labelAr: 'سجل النشاط', labelEn: 'Activity log' },
    ],
    stats: [
      { labelAr: 'كل الحسابات', labelEn: 'All accounts', value: '2,840', helperAr: 'داخل نطاق مصر', helperEn: 'Within Egypt scope', tone: 'berry' },
      { labelAr: 'نشطون', labelEn: 'Active', value: '2,612', helperAr: 'عملاء ومطاعم وسائقون', helperEn: 'Customers, restaurants, drivers', tone: 'green' },
      { labelAr: 'تحتاج مراجعة', labelEn: 'Needs review', value: '41', helperAr: 'تعطيل أو اعتماد أو وثائق', helperEn: 'Suspension, approval, or documents', tone: 'warm' },
    ],
    leadPanelTitleAr: 'تقسيم المستخدمين',
    leadPanelTitleEn: 'User segments',
    leadPanelDescriptionAr: 'الصفحة مختصرة: مؤشرات صغيرة، فلاتر، ثم جدول كل المستخدمين مباشرة.',
    leadPanelDescriptionEn: 'Compact page: small KPIs, filters, then the full user table.',
    leadItems: [
      { titleAr: 'العملاء', titleEn: 'Customers', metaAr: 'Customers', metaEn: 'Customers', descriptionAr: 'حسابات التطبيق، الاشتراكات، الحالة، وآخر نشاط.', descriptionEn: 'App accounts, subscriptions, status, and last activity.', tone: 'green', valueAr: '2,140', valueEn: '2,140', filterKey: 'customer' },
      { titleAr: 'المطاعم', titleEn: 'Restaurants', metaAr: 'Restaurants', metaEn: 'Restaurants', descriptionAr: 'حسابات المطاعم وحالة الاعتماد والوثائق.', descriptionEn: 'Restaurant accounts, approval status, and documents.', tone: 'blue', valueAr: '326', valueEn: '326', filterKey: 'restaurant' },
      { titleAr: 'السائقون', titleEn: 'Drivers', metaAr: 'Drivers', metaEn: 'Drivers', descriptionAr: 'سائقون عامون أو تابعون لمطعم مع حالة التفعيل.', descriptionEn: 'Independent or restaurant-linked drivers with activation status.', tone: 'warm', valueAr: '306', valueEn: '306', filterKey: 'driver' },
    ],
    sidePanelTitleAr: 'فلاتر سريعة',
    sidePanelTitleEn: 'Quick filters',
    sidePanelDescriptionAr: 'اختصارات واجهة؛ الربط الحقيقي لاحقًا يكون مع API المستخدمين.',
    sidePanelDescriptionEn: 'UI shortcuts; real binding will come from the users API.',
    sideItems: [
      { titleAr: 'النوع', titleEn: 'Type', metaAr: 'الكل', metaEn: 'All', descriptionAr: 'عميل / مطعم / سائق / أدمن.', descriptionEn: 'Customer / restaurant / driver / admin.', tone: 'green' },
      { titleAr: 'الحالة', titleEn: 'Status', metaAr: 'نشط', metaEn: 'Active', descriptionAr: 'نشط، قيد المراجعة، موقوف، دعوة معلقة.', descriptionEn: 'Active, under review, suspended, pending invite.', tone: 'warm' },
      { titleAr: 'النطاق', titleEn: 'Scope', metaAr: 'مصر', metaEn: 'Egypt', descriptionAr: 'Country Admin يرى حسابات نطاقه فقط حسب workflow F28.', descriptionEn: 'Country Admin sees only scoped accounts per F28 workflow.', tone: 'blue' },
    ],
    tableTitleAr: 'دليل مستخدمي النظام',
    tableTitleEn: 'System user directory',
    tableDescriptionAr: 'جدول واحد لكل المستخدمين مع النوع، وسيلة التواصل، النطاق، الحالة، التحقق، وآخر نشاط.',
    tableDescriptionEn: 'One table for all users with type, contact, scope, status, verification, and last activity.',
    columns: [
      { key: 'name', labelAr: 'الاسم', labelEn: 'Name' },
      { key: 'type', labelAr: 'النوع', labelEn: 'Type' },
      { key: 'contact', labelAr: 'التواصل', labelEn: 'Contact' },
      { key: 'scope', labelAr: 'النطاق', labelEn: 'Scope' },
      { key: 'status', labelAr: 'الحالة', labelEn: 'Status' },
      { key: 'verification', labelAr: 'التحقق', labelEn: 'Verification' },
      { key: 'lastActivity', labelAr: 'آخر نشاط', labelEn: 'Last activity' },
    ],
    rows: [
      { id: 'cust-aya', tone: 'green', filterKey: 'customer', cellsAr: { name: 'Aya Mahmoud', type: 'عميل', contact: 'aya@example.com / +20 100 111 2233', scope: 'Egypt / Cairo', status: 'نشط', verification: 'Email + Phone', lastActivity: 'منذ 8 دقائق' }, cellsEn: { name: 'Aya Mahmoud', type: 'Customer', contact: 'aya@example.com / +20 100 111 2233', scope: 'Egypt / Cairo', status: 'Active', verification: 'Email + Phone', lastActivity: '8 min ago' } },
      { id: 'cust-karim', tone: 'warm', filterKey: 'customer', cellsAr: { name: 'Karim Ali', type: 'عميل', contact: 'karim@example.com', scope: 'Egypt / Giza', status: 'اشتراك مجمد', verification: 'Phone only', lastActivity: 'اليوم 11:20' }, cellsEn: { name: 'Karim Ali', type: 'Customer', contact: 'karim@example.com', scope: 'Egypt / Giza', status: 'Frozen subscription', verification: 'Phone only', lastActivity: 'Today 11:20' } },
      { id: 'rest-green-bowl', tone: 'blue', filterKey: 'restaurant', cellsAr: { name: 'Green Bowl', type: 'مطعم', contact: 'ops@greenbowl.eg', scope: 'Egypt / Cairo East', status: 'قيد المراجعة', verification: 'وثائق ناقصة', lastActivity: 'منذ ساعتين' }, cellsEn: { name: 'Green Bowl', type: 'Restaurant', contact: 'ops@greenbowl.eg', scope: 'Egypt / Cairo East', status: 'Under review', verification: 'Missing documents', lastActivity: '2 hours ago' } },
      { id: 'driver-hassan', tone: 'green', filterKey: 'driver', cellsAr: { name: 'Hassan Youssef', type: 'سائق', contact: '+20 122 778 9000', scope: 'Egypt / New Cairo', status: 'نشط', verification: 'رخصة صالحة', lastActivity: 'منذ 14 دقيقة' }, cellsEn: { name: 'Hassan Youssef', type: 'Driver', contact: '+20 122 778 9000', scope: 'Egypt / New Cairo', status: 'Active', verification: 'Valid license', lastActivity: '14 min ago' } },
      { id: 'driver-salma', tone: 'red', filterKey: 'driver', cellsAr: { name: 'Salma Nabil', type: 'سائق', contact: '+20 101 808 5511', scope: 'Egypt / Giza', status: 'موقوف', verification: 'رخصة منتهية', lastActivity: 'أمس' }, cellsEn: { name: 'Salma Nabil', type: 'Driver', contact: '+20 101 808 5511', scope: 'Egypt / Giza', status: 'Suspended', verification: 'Expired license', lastActivity: 'Yesterday' } },
      { id: 'admin-mona', tone: 'slate', filterKey: 'admin', cellsAr: { name: 'Mona Hassan', type: 'أدمن', contact: 'mona@mealmate.app', scope: 'Egypt / Cairo', status: 'نشط', verification: '2FA مفعل', lastActivity: 'منذ 12 دقيقة' }, cellsEn: { name: 'Mona Hassan', type: 'Admin', contact: 'mona@mealmate.app', scope: 'Egypt / Cairo', status: 'Active', verification: '2FA enabled', lastActivity: '12 min ago' } },
    ],
    drawerTitleAr: 'ملخص الحساب المحدد',
    drawerTitleEn: 'Selected account summary',
    drawerDescriptionAr: 'مساحة مختصرة لتفاصيل حساب واحد بدون زحمة داخل الجدول.',
    drawerDescriptionEn: 'Compact space for one account without cluttering the table.',
    drawerFields: [
      { titleAr: 'Workflow rule', titleEn: 'Workflow rule', metaAr: 'F01 / F28', metaEn: 'F01 / F28', descriptionAr: 'الاعتماد والتعطيل يتمان داخل نطاق الدولة ويسجلان في Audit.', descriptionEn: 'Approval and suspension happen within country scope and are audit-logged.', tone: 'green' },
      { titleAr: 'Next action', titleEn: 'Next action', metaAr: 'Review', metaEn: 'Review', descriptionAr: 'راجع الوثائق أو حالة الاشتراك قبل تعطيل حساب له تعاملات نشطة.', descriptionEn: 'Review documents or subscription status before suspending an active account.', tone: 'warm' },
    ],
  },
  userInvites: {
    id: 'userInvites',
    route: '/admin/security/users/invitations',
    pageNo: '06B',
    eyebrowAr: 'Invites & Activity',
    eyebrowEn: 'Invites & Activity',
    titleAr: 'الدعوات وسجل النشاط',
    titleEn: 'Invites & activity log',
    goalAr: 'صفحة منفصلة للدعوات المعلقة وسجل النشاط حتى لا تزحم جدول المستخدمين.',
    goalEn: 'Separate page for pending invites and activity so the user table stays clean.',
    roleChipAr: 'Security Admin',
    roleChipEn: 'Security Admin',
    scopeChipAr: 'Scoped activity log',
    scopeChipEn: 'Scoped activity log',
    primaryActionAr: 'إرسال دعوة',
    primaryActionEn: 'Send invite',
    actions: [
      { labelAr: 'إعادة إرسال', labelEn: 'Resend' },
      { labelAr: 'إلغاء دعوة', labelEn: 'Cancel invite' },
      { labelAr: 'فتح سجل النشاط', labelEn: 'Open activity log' },
    ],
    stats: [
      { labelAr: 'دعوات معلقة', labelEn: 'Pending invites', value: '7', helperAr: '3 قاربت الانتهاء', helperEn: '3 expiring soon', tone: 'warm' },
      { labelAr: 'نشاط حساس', labelEn: 'Sensitive activity', value: '12', helperAr: 'آخر 24 ساعة', helperEn: 'Last 24 hours', tone: 'red' },
      { labelAr: 'Reset 2FA', labelEn: 'Reset 2FA', value: '5', helperAr: 'هذا الأسبوع', helperEn: 'This week', tone: 'blue' },
    ],
    leadPanelTitleAr: 'Invite admin modal',
    leadPanelTitleEn: 'Invite admin modal',
    leadPanelDescriptionAr: 'كل خطوات الدعوة في مساحة مخصصة: البريد، الدور، النطاق، والتحقق.',
    leadPanelDescriptionEn: 'All invite steps in one space: email, role, scope, and verification.',
    leadItems: [
      { titleAr: 'Sara Adel', titleEn: 'Sara Adel', metaAr: 'Pending invitation', metaEn: 'Pending invitation', descriptionAr: 'Security Admin، الدعوة أرسلت منذ 5 أيام.', descriptionEn: 'Security Admin invite sent 5 days ago.', tone: 'warm', valueAr: 'ينتهي قريبا', valueEn: 'Expiring soon' },
      { titleAr: 'Youssef Nabil', titleEn: 'Youssef Nabil', metaAr: 'Scope review', metaEn: 'Scope review', descriptionAr: 'Operations، يحتاج اختيار منطقة تشغيل.', descriptionEn: 'Operations role needs an operating region.', tone: 'blue', valueAr: 'مراجعة', valueEn: 'Review' },
      { titleAr: 'Dina Magdy', titleEn: 'Dina Magdy', metaAr: 'Accepted', metaEn: 'Accepted', descriptionAr: 'Country Admin، قبلت الدعوة وفعلت 2FA.', descriptionEn: 'Country Admin accepted the invite and enabled 2FA.', tone: 'green', valueAr: 'تم', valueEn: 'Done' },
    ],
    sidePanelTitleAr: 'Activity preview',
    sidePanelTitleEn: 'Activity preview',
    sidePanelDescriptionAr: 'أحدث أحداث الأمان المرتبطة بالمستخدمين.',
    sidePanelDescriptionEn: 'Latest security events linked to users.',
    sideItems: [
      { titleAr: 'تغيير نطاق', titleEn: 'Scope change', metaAr: 'منذ 18 دقيقة', metaEn: '18 min ago', descriptionAr: 'تم نقل Mona إلى نطاق القاهرة الكبرى.', descriptionEn: 'Mona was moved to Greater Cairo scope.', tone: 'blue' },
      { titleAr: 'Reset 2FA', titleEn: 'Reset 2FA', metaAr: 'منذ ساعتين', metaEn: '2 hours ago', descriptionAr: 'طلب Omar إعادة ضبط 2FA وينتظر التأكيد.', descriptionEn: 'Omar requested a 2FA reset and awaits confirmation.', tone: 'warm' },
      { titleAr: 'Suspended user', titleEn: 'Suspended user', metaAr: 'أمس', metaEn: 'Yesterday', descriptionAr: 'تم إيقاف مستخدم بسبب تعارض نطاق.', descriptionEn: 'A user was suspended due to a scope conflict.', tone: 'red' },
    ],
    tableTitleAr: 'الدعوات والنشاط',
    tableTitleEn: 'Invites & activity',
    tableDescriptionAr: 'تجميع الدعوات والسجل في صفحة منفصلة.',
    tableDescriptionEn: 'Invites and log combined on a separate page.',
    columns: [
      { key: 'type', labelAr: 'النوع', labelEn: 'Type' },
      { key: 'entity', labelAr: 'المستخدم/الدعوة', labelEn: 'User / invite' },
      { key: 'role', labelAr: 'الدور', labelEn: 'Role' },
      { key: 'scope', labelAr: 'النطاق', labelEn: 'Scope' },
      { key: 'status', labelAr: 'الحالة', labelEn: 'Status' },
      { key: 'time', labelAr: 'الوقت', labelEn: 'Time' },
    ],
    rows: [
      { id: 'invite-sara', tone: 'warm', filterKey: 'invite', cellsAr: { type: 'دعوة', entity: 'sara@mealmate.app', role: 'Security Admin', scope: 'Global', status: 'معلقة', time: 'منذ 5 أيام' }, cellsEn: { type: 'Invite', entity: 'sara@mealmate.app', role: 'Security Admin', scope: 'Global', status: 'Pending', time: '5 days ago' } },
      { id: 'activity-mona', tone: 'blue', filterKey: 'activity', cellsAr: { type: 'نشاط', entity: 'Mona Hassan', role: 'Country Admin', scope: 'Cairo', status: 'تغيير نطاق', time: 'منذ 18 دقيقة' }, cellsEn: { type: 'Activity', entity: 'Mona Hassan', role: 'Country Admin', scope: 'Cairo', status: 'Scope change', time: '18 min ago' } },
      { id: 'activity-stop', tone: 'red', filterKey: 'activity', cellsAr: { type: 'نشاط', entity: 'Old Admin', role: 'Operations', scope: 'Giza', status: 'Suspended', time: 'أمس' }, cellsEn: { type: 'Activity', entity: 'Old Admin', role: 'Operations', scope: 'Giza', status: 'Suspended', time: 'Yesterday' } },
    ],
    drawerTitleAr: 'تأكيد إيقاف مستخدم',
    drawerTitleEn: 'Confirm user suspension',
    drawerDescriptionAr: 'سيتم إلغاء الجلسات النشطة وتسجيل السبب في سجل الأمان.',
    drawerDescriptionEn: 'Active sessions will be revoked and the reason logged in the security audit trail.',
    drawerFields: [
      { titleAr: 'Reason', titleEn: 'Reason', metaAr: 'Scope conflict', metaEn: 'Scope conflict', descriptionAr: 'تعارض نطاق مع صلاحية المدير الحالي.', descriptionEn: 'Scope conflict with the current manager permissions.', tone: 'red' },
      { titleAr: 'Audit', titleEn: 'Audit', metaAr: 'Required', metaEn: 'Required', descriptionAr: 'يسجل السبب والوقت والمسؤول.', descriptionEn: 'Logs reason, time, and responsible admin.', tone: 'warm' },
    ],
  },
};
