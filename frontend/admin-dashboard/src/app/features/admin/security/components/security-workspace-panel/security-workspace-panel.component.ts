import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowUpDown,
  lucideChevronRight,
  lucideClock,
  lucideDownload,
  lucideFilter,
  lucideGlobe,
  lucideHistory,
  lucideKey,
  lucideLock,
  lucideMail,
  lucidePhone,
  lucideSearch,
  lucideShield,
  lucideShieldAlert,
  lucideShieldCheck,
  lucideSlidersHorizontal,
  lucideUser,
  lucideX,
} from '@ng-icons/lucide';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { MmTablePaginationComponent } from '../../../../../shared/components/layout/table-pagination';
import {
  SecurityAction,
  SecurityAdminPage,
  SecurityPanelItem,
  SecurityStat,
  SecurityTableColumn,
  SecurityTableRow,
  SecurityTone,
  securityRowCells,
} from '../../data/security-admin-pages.data';
import {
  securityWorkspaceInsightCardVariants,
  securityWorkspaceInsightGridVariants,
  securityWorkspaceShellVariants,
  securityWorkspaceStatCardVariants,
  securityWorkspaceStatsGridVariants,
  securityWorkspaceStatusPillVariants,
  securityWorkspaceTableCellVariants,
  securityWorkspaceTableHeadCellVariants,
  securityWorkspaceTableRowVariants,
  securityWorkspaceTableShellVariants,
  securityWorkspaceTableWrapVariants,
} from './security-workspace-panel.variants';

const PANEL_ICONS = {
  lucideSearch,
  lucideChevronRight,
  lucideFilter,
  lucideDownload,
  lucideHistory,
  lucideArrowUpDown,
  lucideShieldAlert,
  lucideSlidersHorizontal,
  lucideX,
  lucideUser,
  lucideMail,
  lucidePhone,
  lucideGlobe,
  lucideClock,
  lucideShield,
  lucideShieldCheck,
  lucideLock,
  lucideKey,
};

@Component({
  selector: 'mm-security-workspace-panel',
  standalone: true,
  imports: [NgClass, NgIcon, MmTablePaginationComponent],
  providers: [provideIcons(PANEL_ICONS)],
  templateUrl: './security-workspace-panel.component.html',
  host: {
    class: 'block',
  },
})
export class SecurityWorkspacePanelComponent {
  readonly locale = inject(AppLocaleService);
  readonly page = input.required<SecurityAdminPage>();

  // Interactive Table State
  readonly searchQuery = signal<string>('');
  readonly activeTypeFilter = signal<string>('all');
  readonly currentPage = signal<number>(1);
  readonly pageSize = signal<number>(3);
  readonly pageSizeOptions = [3, 5, 10];

  // Selected Row for Drawer/Modal Details
  readonly selectedRow = signal<SecurityTableRow | null>(null);

  // Editing State
  readonly isEditing = signal<boolean>(false);
  readonly showSuccessToast = signal<boolean>(false);

  // Editable Fields for User
  readonly editUserRole = signal<string>('');
  readonly editUserScope = signal<string>('');
  readonly editUserStatus = signal<string>('');
  readonly editUser2FA = signal<boolean>(true);

  // Editable lists for other types
  readonly editablePermissions = signal<Array<{ module: string; level: string; progress: number; tone: SecurityTone }>>([]);
  readonly editableMatrix = signal<Array<{ role: string; level: string; progress: number; tone: SecurityTone }>>([]);
  readonly editableScope = signal<Array<{ title: string; status: string; desc: string; tone: SecurityTone }>>([]);
  readonly editableInvite = signal<Array<{ title: string; value: string; desc: string; tone: SecurityTone }>>([]);

  constructor() {
    // Reset pagination and filters when page changes
    effect(() => {
      this.page();
      this.currentPage.set(1);
      this.searchQuery.set('');
      this.activeTypeFilter.set('all');
      this.selectedRow.set(null);
      this.isEditing.set(false);
    }, { allowSignalWrites: true });
  }

  // Filter and Search Logic
  readonly filteredRows = computed(() => {
    let rows = this.page().rows;
    const query = this.searchQuery().trim().toLowerCase();
    const filterVal = this.activeTypeFilter();

    if (query) {
      rows = rows.filter((row) =>
        Object.values(this.rowCells(row)).some((val) =>
          val.toLowerCase().includes(query)
        )
      );
    }

    if (filterVal !== 'all') {
      rows = rows.filter((row) => row.filterKey === filterVal);
    }

    return rows;
  });

  // Pagination Logic
  readonly totalRows = computed(() => this.filteredRows().length);
  readonly totalPages = computed(() => Math.ceil(this.totalRows() / this.pageSize()) || 1);

  readonly paginatedRows = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredRows().slice(start, start + this.pageSize());
  });

  toggleTypeFilter(filterKey: string): void {
    if (this.activeTypeFilter() === filterKey) {
      this.activeTypeFilter.set('all');
    } else {
      this.activeTypeFilter.set(filterKey);
    }
    this.currentPage.set(1);
  }

  t(ar: string, en: string): string {
    return this.locale.isRtl() ? ar : en;
  }

  statLabel(stat: SecurityStat): string {
    return this.t(stat.labelAr, stat.labelEn);
  }

  statHelper(stat: SecurityStat): string {
    return this.t(stat.helperAr, stat.helperEn);
  }

  actionLabel(action: SecurityAction): string {
    return this.t(action.labelAr, action.labelEn);
  }

  panelTitle(item: SecurityPanelItem): string {
    return this.t(item.titleAr, item.titleEn);
  }

  panelMeta(item: SecurityPanelItem): string {
    return this.t(item.metaAr, item.metaEn);
  }

  panelDescription(item: SecurityPanelItem): string {
    return this.t(item.descriptionAr, item.descriptionEn);
  }

  panelValue(item: SecurityPanelItem): string | undefined {
    if (item.valueAr || item.valueEn) {
      return this.t(item.valueAr ?? '', item.valueEn ?? '');
    }
    return undefined;
  }

  columnLabel(column: SecurityTableColumn): string {
    return this.t(column.labelAr, column.labelEn);
  }

  rowCells(row: SecurityTableRow): Record<string, string> {
    return securityRowCells(row, this.locale.isRtl());
  }

  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    this.currentPage.set(1);
  }

  setPage(pageNo: number): void {
    if (pageNo >= 1 && pageNo <= this.totalPages()) {
      this.currentPage.set(pageNo);
    }
  }

  setPageSize(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1);
  }

  // Row selection handler
  selectRow(row: SecurityTableRow): void {
    this.selectedRow.set(row);
  }

  closeDrawer(): void {
    this.selectedRow.set(null);
    this.isEditing.set(false);
  }

  startEditing(): void {
    const row = this.selectedRow();
    if (!row) return;

    this.isEditing.set(true);

    const type = this.selectedRowType();
    const cells = this.rowCells(row);
    if (type === 'user') {
      this.editUserRole.set(cells['type'] || this.t('عميل', 'Customer'));
      this.editUserScope.set(cells['scope'] || 'Egypt / Cairo');
      this.editUserStatus.set(cells['status'] || this.t('نشط', 'Active'));
      this.editUser2FA.set(cells['verification']?.includes('2FA') || cells['verification']?.includes('Email') || true);
    } else if (type === 'role') {
      this.editablePermissions.set(JSON.parse(JSON.stringify(this.selectedRolePermissions())));
    } else if (type === 'matrix') {
      this.editableMatrix.set(JSON.parse(JSON.stringify(this.selectedMatrixPermissions())));
    } else if (type === 'scope') {
      this.editableScope.set(JSON.parse(JSON.stringify(this.selectedScopeDetails())));
    } else if (type === 'invite') {
      this.editableInvite.set(JSON.parse(JSON.stringify(this.selectedInviteDetails())));
    }
  }

  updatePermissionLevel(perm: { module: string; level: string; progress: number; tone: SecurityTone }, event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    perm.level = value;
    if (value.includes('Full')) {
      perm.progress = 100;
      perm.tone = 'red';
    } else if (value.includes('Approve') || value.includes('Suspend')) {
      perm.progress = 80;
      perm.tone = 'green';
    } else if (value.includes('Manage Scoped')) {
      perm.progress = 70;
      perm.tone = 'green';
    } else if (value.includes('Manage')) {
      perm.progress = 70;
      perm.tone = 'blue';
    } else if (value.includes('View')) {
      perm.progress = 40;
      perm.tone = 'blue';
    } else {
      perm.progress = 0;
      perm.tone = 'slate';
    }
  }

  updateMatrixLevel(perm: { role: string; level: string; progress: number; tone: SecurityTone }, event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    perm.level = value;
    if (value === 'Full') {
      perm.progress = 100;
      perm.tone = 'red';
    } else if (value === 'Approve') {
      perm.progress = 80;
      perm.tone = 'green';
    } else if (value.includes('Manage')) {
      perm.progress = 70;
      perm.tone = 'blue';
    } else if (value === 'Request') {
      perm.progress = 50;
      perm.tone = 'warm';
    } else if (value === 'View') {
      perm.progress = 30;
      perm.tone = 'slate';
    } else {
      perm.progress = 0;
      perm.tone = 'slate';
    }
  }

  updateScopeStatus(item: { title: string; status: string; desc: string; tone: SecurityTone }, event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    item.status = value;
    if (value === 'Required' || value === 'Full') {
      item.tone = 'green';
    } else if (value === 'Dual' || value === 'Sensitive only') {
      item.tone = 'red';
    } else {
      item.tone = 'warm';
    }
  }

  updateInviteValue(item: { title: string; value: string; desc: string; tone: SecurityTone }, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    item.value = value;
  }

  saveChanges(): void {
    const row = this.selectedRow();
    if (!row) return;

    const type = this.selectedRowType();
    const cellsAr = row.cellsAr;
    const cellsEn = row.cellsEn;

    if (type === 'user') {
      const roleAr = this.editUserRole();
      const roleEn = this.userRoleEn(roleAr);
      const statusAr = this.editUserStatus();
      const statusEn = this.userStatusEn(statusAr);

      cellsAr['type'] = roleAr;
      cellsEn['type'] = roleEn;
      cellsAr['scope'] = this.editUserScope();
      cellsEn['scope'] = this.editUserScope();
      cellsAr['status'] = statusAr;
      cellsEn['status'] = statusEn;
      cellsAr['verification'] = this.editUser2FA() ? 'Email + Phone + 2FA' : 'Email + Phone';
      cellsEn['verification'] = this.editUser2FA() ? 'Email + Phone + 2FA' : 'Email + Phone';

      if (statusAr === 'نشط' || statusEn === 'Active') {
        row.tone = 'green';
      } else if (statusAr === 'موقوف' || statusEn === 'Suspended') {
        row.tone = 'red';
      } else {
        row.tone = 'warm';
      }
    } else if (type === 'role') {
      const activePerms = this.editablePermissions();
      const modulesWithAccess = activePerms
        .filter(p => p.progress > 0 && !p.level.includes('No Access') && !p.level.includes('لا يوجد'))
        .map(p => p.module.split(' ')[0])
        .join(' / ');
      cellsAr['modules'] = modulesWithAccess || this.t('لا يوجد صلاحيات', 'No permissions');
      cellsEn['modules'] = modulesWithAccess || 'No permissions';
    } else if (type === 'matrix') {
      const activeMatrix = this.editableMatrix();
      activeMatrix.forEach(m => {
        const key = m.role === 'Super Admin' ? 'superAdmin' :
                    m.role === 'Country Admin' ? 'countryAdmin' :
                    m.role === 'Operations' ? 'operations' : 'finance';
        cellsAr[key] = m.level;
        cellsEn[key] = m.level;
      });
    } else if (type === 'scope') {
      const activeScope = this.editableScope();
      activeScope.forEach(s => {
        const key = s.title.includes('2FA') ? 'twoFa' :
                    s.title.includes('الموافقات') || s.title.includes('Approvals') ? 'approval' : 'audit';
        cellsAr[key] = s.status;
        cellsEn[key] = s.status;
      });
    } else if (type === 'invite') {
      const activeInvite = this.editableInvite();
      activeInvite.forEach(s => {
        const key = s.title.includes('حالة') || s.title.includes('Status') ? 'status' :
                    s.title.includes('نطاق') || s.title.includes('Scope') ? 'scope' : 'role';
        cellsAr[key] = s.value;
        cellsEn[key] = s.value;
      });
    }

    this.showSuccessToast.set(true);
    setTimeout(() => {
      this.showSuccessToast.set(false);
    }, 3000);

    this.isEditing.set(false);
  }

  // Determine the type of selected row based on active page
  readonly selectedRowType = computed(() => {
    const pageId = this.page().id;
    if (pageId === 'roles') return 'role';
    if (pageId === 'roleMatrix') return 'matrix';
    if (pageId === 'roleScopes') return 'scope';
    if (pageId === 'users') return 'user';
    if (pageId === 'userInvites') return 'invite';
    return 'user';
  });

  // Dynamic Title for Selected Row
  readonly selectedRowTitle = computed(() => {
    const row = this.selectedRow();
    if (!row) return '';
    const cells = this.rowCells(row);
    const type = this.selectedRowType();
    if (type === 'role') return cells['role'] || '';
    if (type === 'matrix') return cells['module'] || '';
    if (type === 'scope') return cells['role'] || '';
    if (type === 'user') return cells['name'] || '';
    if (type === 'invite') {
      const entity = cells['entity'] || '';
      return entity.split('(')[0].trim();
    }
    return this.t('تفاصيل السجل', 'Record details');
  });

  // Dynamic Subtitle for Selected Row
  readonly selectedRowSubtitle = computed(() => {
    const row = this.selectedRow();
    if (!row) return '';
    const cells = this.rowCells(row);
    const type = this.selectedRowType();
    if (type === 'role') return this.t('دور نظام أساسي وصلاحياته', 'System role and permissions');
    if (type === 'matrix') return this.t('توزيع صلاحيات وحدة النظام عبر الأدوار', 'Module permissions across roles');
    if (type === 'scope') return this.t('نطاق الوصول والأفعال الحساسة للدور', 'Access scope and sensitive actions');
    if (type === 'user') return this.t(`حساب مستخدم (${cells['type'] || ''})`, `User account (${cells['type'] || ''})`);
    if (type === 'invite') return this.t(`سجل (${cells['type'] || ''})`, `Record (${cells['type'] || ''})`);
    return '';
  });

  // Dynamic Status for Selected Row
  readonly selectedRowStatus = computed(() => {
    const row = this.selectedRow();
    if (!row) return '';
    const cells = this.rowCells(row);
    const type = this.selectedRowType();
    if (type === 'role') return this.t('نشط ومحمي', 'Active & Protected');
    if (type === 'matrix') return this.t('وحدة نشطة', 'Active Module');
    return cells['status'] || cells['protection'] || cells['state'] || this.t('نشط', 'Active');
  });

  // Get key-value details for selected row
  readonly selectedRowDetailsList = computed(() => {
    const row = this.selectedRow();
    if (!row) return [];
    const type = this.selectedRowType();
    const cells = this.rowCells(row);

    return Object.entries(cells)
      .filter(([key]) => {
        // Filter out keys used in title/header
        if (type === 'role' && (key === 'role' || key === 'modules')) return false;
        if (type === 'matrix' && key === 'module') return false;
        if (type === 'scope' && key === 'role') return false;
        if (type === 'user' && (key === 'name' || key === 'type')) return false;
        if (type === 'invite' && (key === 'entity' || key === 'type')) return false;
        return true;
      })
      .map(([key, value]) => {
        return {
          key,
          label: this.getColumnLabel(key),
          value,
          icon: this.getIconForKey(key),
        };
      });
  });

  // Check if the selected row is a Role
  readonly isSelectedRowRole = computed(() => {
    return this.selectedRowType() === 'role';
  });

  // Dynamic permissions for the selected role
  readonly selectedRolePermissions = computed((): Array<{ module: string; level: string; progress: number; tone: SecurityTone }> => {
    const row = this.selectedRow();
    if (!row) return [];

    const roleName = (this.rowCells(row)['role'] || '').toLowerCase().trim();
    const ar = this.locale.isRtl();

    if (roleName.includes('super admin')) {
      return [
        { module: ar ? 'Accounts (الحسابات)' : 'Accounts', level: ar ? 'Full Access (وصول كامل)' : 'Full Access', progress: 100, tone: 'red' },
        { module: ar ? 'Operations (العمليات)' : 'Operations', level: ar ? 'Full Access (وصول كامل)' : 'Full Access', progress: 100, tone: 'red' },
        { module: ar ? 'Finance (المالية)' : 'Finance', level: ar ? 'Full Access (وصول كامل)' : 'Full Access', progress: 100, tone: 'red' },
        { module: ar ? 'Security (الأمان)' : 'Security', level: ar ? 'Full Access (وصول كامل)' : 'Full Access', progress: 100, tone: 'red' },
        { module: ar ? 'Support (الدعم الفني)' : 'Support', level: ar ? 'Full Access (وصول كامل)' : 'Full Access', progress: 100, tone: 'red' },
      ];
    }

    if (roleName.includes('country admin')) {
      return [
        { module: ar ? 'Accounts (الحسابات)' : 'Accounts', level: ar ? 'Approve & Suspend (اعتماد وتجميد)' : 'Approve & Suspend', progress: 80, tone: 'green' },
        { module: ar ? 'Operations (العمليات)' : 'Operations', level: ar ? 'Manage Scoped (إدارة النطاق)' : 'Manage Scoped', progress: 70, tone: 'green' },
        { module: ar ? 'Finance (المالية)' : 'Finance', level: ar ? 'View Scoped (عرض النطاق)' : 'View Scoped', progress: 40, tone: 'blue' },
        { module: ar ? 'Security (الأمان)' : 'Security', level: ar ? 'Scoped Users (مستخدمو النطاق)' : 'Scoped Users', progress: 50, tone: 'blue' },
        { module: ar ? 'Support (الدعم الفني)' : 'Support', level: ar ? 'Manage Complaints (إدارة الشكاوى)' : 'Manage Complaints', progress: 80, tone: 'green' },
      ];
    }

    if (roleName.includes('finance viewer') || roleName.includes('finance approver')) {
      return [
        { module: ar ? 'Accounts (الحسابات)' : 'Accounts', level: ar ? 'View Only (عرض فقط)' : 'View Only', progress: 20, tone: 'slate' },
        { module: ar ? 'Operations (العمليات)' : 'Operations', level: ar ? 'View Only (عرض فقط)' : 'View Only', progress: 20, tone: 'slate' },
        { module: ar ? 'Finance (المالية)' : 'Finance', level: ar ? 'Refunds & Settlements (اعتماد مالي)' : 'Refunds & Settlements', progress: 90, tone: 'red' },
        { module: ar ? 'Security (الأمان)' : 'Security', level: ar ? 'No Access (لا يوجد صلاحية)' : 'No Access', progress: 0, tone: 'slate' },
        { module: ar ? 'Support (الدعم الفني)' : 'Support', level: ar ? 'View Settlements (عرض التسويات)' : 'View Settlements', progress: 40, tone: 'blue' },
      ];
    }

    return [
      { module: ar ? 'Accounts (الحسابات)' : 'Accounts', level: ar ? 'View Only (عرض فقط)' : 'View Only', progress: 20, tone: 'slate' },
      { module: ar ? 'Operations (العمليات)' : 'Operations', level: ar ? 'Full Manage (إدارة كاملة للطلبات)' : 'Full Manage', progress: 90, tone: 'blue' },
      { module: ar ? 'Finance (المالية)' : 'Finance', level: ar ? 'No Access (لا يوجد صلاحية)' : 'No Access', progress: 0, tone: 'slate' },
      { module: ar ? 'Security (الأمان)' : 'Security', level: ar ? 'No Access (لا يوجد صلاحية)' : 'No Access', progress: 0, tone: 'slate' },
      { module: ar ? 'Support (الدعم الفني)' : 'Support', level: ar ? 'Manage Complaints (إدارة الشكاوى)' : 'Manage Complaints', progress: 80, tone: 'green' },
    ];
  });

  // Dynamic role matrix permissions breakdown
  readonly selectedMatrixPermissions = computed((): Array<{ role: string; level: string; progress: number; tone: SecurityTone }> => {
    const row = this.selectedRow();
    if (!row || this.selectedRowType() !== 'matrix') return [];
    const cells = this.rowCells(row);

    return [
      { role: 'Super Admin', level: cells['superAdmin'] || '-', progress: cells['superAdmin'] === 'Full' ? 100 : cells['superAdmin'] === 'Approve' ? 80 : 0, tone: 'red' },
      { role: 'Country Admin', level: cells['countryAdmin'] || '-', progress: cells['countryAdmin'] === 'Full' ? 100 : cells['countryAdmin']?.includes('Manage') ? 70 : cells['countryAdmin'] === 'Approve' ? 80 : cells['countryAdmin'] === 'Request' ? 50 : 0, tone: 'green' },
      { role: 'Operations', level: cells['operations'] || '-', progress: cells['operations'] === 'Manage' ? 70 : cells['operations'] === 'View' ? 30 : 0, tone: 'blue' },
      { role: 'Finance Viewer', level: cells['finance'] || '-', progress: cells['finance'] === 'View' ? 30 : 0, tone: 'slate' },
    ];
  });

  // Dynamic scope details breakdown
  readonly selectedScopeDetails = computed((): Array<{ title: string; status: string; desc: string; tone: SecurityTone }> => {
    const row = this.selectedRow();
    if (!row || this.selectedRowType() !== 'scope') return [];
    const cells = this.rowCells(row);

    return [
      { title: this.t('المصادقة الثنائية (2FA)', 'Two-Factor Auth'), status: cells['twoFa'] || 'Required', desc: this.t('مطلوب لتأكيد الهوية عند الدخول من جهاز جديد.', 'Required for identity verification on new devices.'), tone: 'warm' },
      { title: this.t('الموافقات الحساسة', 'Sensitive Approvals'), status: cells['approval'] || 'Required', desc: this.t('يتطلب موافقة ثنائية للأفعال عالية الخطورة.', 'Requires dual approval for high-risk actions.'), tone: 'red' },
      { title: this.t('سجل التدقيق (Audit)', 'Audit Trail'), status: cells['audit'] || 'Full', desc: this.t('تسجيل كامل وتفصيلي لجميع الحركات الأمنية.', 'Full and detailed logging of all security events.'), tone: 'green' },
    ];
  });

  // Dynamic invitation details breakdown
  readonly selectedInviteDetails = computed((): Array<{ title: string; value: string; desc: string; tone: SecurityTone }> => {
    const row = this.selectedRow();
    if (!row || this.selectedRowType() !== 'invite') return [];
    const cells = this.rowCells(row);
    const isInvite = row.filterKey === 'invite' || (cells['type'] || '').toLowerCase().includes('invite') || (cells['type'] || '').includes('دعوة');

    return [
      { title: this.t('حالة الرابط', 'Link Status'), value: cells['status'] || '', desc: isInvite ? this.t('رابط الدعوة صالح للاستخدام.', 'Invitation link is valid.') : this.t('تم تسجيل الإجراء بنجاح.', 'Action logged successfully.'), tone: 'green' },
      { title: this.t('نطاق الصلاحية', 'Access Scope'), value: cells['scope'] || '', desc: this.t('النطاق الجغرافي المحدد للعمليات.', 'Geographic scope defined for operations.'), tone: 'blue' },
      { title: this.t('الدور الوظيفي', 'Assigned Role'), value: cells['role'] || '', desc: this.t('الدور الأمني الممنوح للحساب.', 'Security role assigned to the account.'), tone: 'warm' },
    ];
  });

  getColumnLabel(key: string): string {
    const col = this.page().columns.find((c) => c.key === key);
    if (col) return this.columnLabel(col);

    const mappingAr: Record<string, string> = {
      name: 'الاسم',
      type: 'النوع',
      contact: 'التواصل',
      scope: 'النطاق',
      status: 'الحالة',
      verification: 'التحقق',
      lastActivity: 'آخر نشاط',
      role: 'الدور',
      twoFa: '2FA',
      approval: 'الموافقة',
      audit: 'Audit',
      protection: 'الحماية',
      state: 'الحالة',
      modules: 'الوحدات',
      updated: 'آخر تحديث',
      users: 'المستخدمون المشمولون',
      time: 'الوقت',
      entity: 'الجهة/المستخدم',
    };
    const mappingEn: Record<string, string> = {
      name: 'Name',
      type: 'Type',
      contact: 'Contact',
      scope: 'Scope',
      status: 'Status',
      verification: 'Verification',
      lastActivity: 'Last activity',
      role: 'Role',
      twoFa: '2FA',
      approval: 'Approval',
      audit: 'Audit',
      protection: 'Protection',
      state: 'State',
      modules: 'Modules',
      updated: 'Last updated',
      users: 'Linked users',
      time: 'Time',
      entity: 'Entity / user',
    };
    return this.t(mappingAr[key] ?? key, mappingEn[key] ?? key);
  }

  userRoleEn(role: string): string {
    const map: Record<string, string> = {
      'عميل': 'Customer',
      'مطعم': 'Restaurant',
      'سائق': 'Driver',
      'أدمن': 'Admin',
    };
    return map[role] ?? role;
  }

  userStatusEn(status: string): string {
    const map: Record<string, string> = {
      'نشط': 'Active',
      'اشتراك مجمد': 'Frozen subscription',
      'قيد المراجعة': 'Under review',
      'موقوف': 'Suspended',
    };
    return map[status] ?? status;
  }

  getIconForKey(key: string): string {
    const mapping: Record<string, string> = {
      name: 'lucideUser',
      type: 'lucideShield',
      contact: 'lucideMail',
      scope: 'lucideGlobe',
      status: 'lucideShieldCheck',
      verification: 'lucideShieldCheck',
      lastActivity: 'lucideClock',
      role: 'lucideUser',
      twoFa: 'lucideLock',
      approval: 'lucideKey',
      audit: 'lucideHistory',
      protection: 'lucideLock',
      state: 'lucideShieldCheck',
      modules: 'lucideSlidersHorizontal',
      updated: 'lucideClock',
      users: 'lucideUser',
      time: 'lucideClock',
      entity: 'lucideUser',
    };
    return mapping[key] || 'lucideShield';
  }

  shellClass(): string {
    return securityWorkspaceShellVariants();
  }

  statsGridClass(): string {
    return securityWorkspaceStatsGridVariants();
  }

  statCardClass(tone: SecurityTone): string {
    return `${securityWorkspaceStatCardVariants()} ${this.toneBorderClass(tone)} ${this.toneSurfaceClass(tone)}`;
  }

  tableShellClass(): string {
    return securityWorkspaceTableShellVariants();
  }

  tableWrapClass(): string {
    return securityWorkspaceTableWrapVariants();
  }

  tableHeadCellClass(): string {
    return securityWorkspaceTableHeadCellVariants();
  }

  tableRowClass(tone: SecurityTone): string {
    return `${securityWorkspaceTableRowVariants()} ${this.toneBorderClass(tone)}`;
  }

  tableCellClass(): string {
    return securityWorkspaceTableCellVariants();
  }

  statusPillClass(tone: SecurityTone): string {
    return `${securityWorkspaceStatusPillVariants()} ${this.toneBadgeClass(tone)}`;
  }

  insightGridClass(): string {
    return securityWorkspaceInsightGridVariants();
  }

  insightCardClass(tone: SecurityTone): string {
    return `${securityWorkspaceInsightCardVariants()} ${this.toneBorderClass(tone)} ${this.toneSurfaceClass(tone)}`;
  }

  badgeClass(tone: SecurityTone): string {
    return this.statusPillClass(tone);
  }

  dotClass(tone: SecurityTone): string {
    return `size-2.5 shrink-0 rounded-full ${this.toneDotClass(tone)}`;
  }

  textClass(tone: SecurityTone): string {
    return this.toneTextClass(tone);
  }

  cell(row: SecurityTableRow, key: string): string {
    return this.rowCells(row)[key] ?? '';
  }

  isStatusColumn(key: string): boolean {
    return (
      key === 'status' ||
      key === 'state' ||
      key === 'protection' ||
      key === 'twoFa' ||
      key === 'approval' ||
      key === 'audit'
    );
  }

  private toneBorderClass(tone: SecurityTone): string {
    const classes: Record<SecurityTone, string> = {
      berry: 'border-s-emerald-600',
      green: 'border-s-emerald-500',
      warm: 'border-s-amber-400',
      red: 'border-s-rose-500',
      blue: 'border-s-sky-500',
      slate: 'border-s-slate-400',
    };

    return classes[tone];
  }

  private toneSurfaceClass(tone: SecurityTone): string {
    const classes: Record<SecurityTone, string> = {
      berry: 'bg-emerald-50/70',
      green: 'bg-emerald-50/70',
      warm: 'bg-amber-50/70',
      red: 'bg-rose-50/70',
      blue: 'bg-sky-50/70',
      slate: 'bg-slate-50/70',
    };

    return classes[tone];
  }

  private toneBadgeClass(tone: SecurityTone): string {
    const classes: Record<SecurityTone, string> = {
      berry: 'border-emerald-200 bg-emerald-50 text-emerald-800',
      green: 'border-emerald-200 bg-emerald-50 text-emerald-700',
      warm: 'border-amber-200 bg-amber-50 text-amber-700',
      red: 'border-rose-200 bg-rose-50 text-rose-700',
      blue: 'border-sky-200 bg-sky-50 text-sky-700',
      slate: 'border-slate-200 bg-slate-50 text-slate-600',
    };

    return classes[tone];
  }

  private toneDotClass(tone: SecurityTone): string {
    const classes: Record<SecurityTone, string> = {
      berry: 'bg-emerald-600',
      green: 'bg-emerald-500',
      warm: 'bg-amber-400',
      red: 'bg-rose-500',
      blue: 'bg-sky-500',
      slate: 'bg-slate-400',
    };

    return classes[tone];
  }

  private toneTextClass(tone: SecurityTone): string {
    const classes: Record<SecurityTone, string> = {
      berry: 'text-emerald-700',
      green: 'text-emerald-700',
      warm: 'text-amber-700',
      red: 'text-rose-600',
      blue: 'text-sky-600',
      slate: 'text-slate-500',
    };

    return classes[tone];
  }
}
