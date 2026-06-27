import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCardComponent } from '@/shared/components/card/card.component';
import { MmTablePaginationComponent } from '@/shared/components/layout/table-pagination';
import { createTablePagination } from '@/shared/utils/table-pagination.util';
import {
  SECURITY_ADMIN_PAGES,
  SECURITY_NAV_LINKS,
  SecurityAction,
  SecurityAdminPage,
  SecurityAdminPageId,
  SecurityNavLink,
  SecurityPanelItem,
  SecurityStat,
  SecurityTableColumn,
  SecurityTableRow,
  SecurityTone,
  securityRowCells,
} from '../../data/security-admin-pages.data';

@Component({
  selector: 'mm-security-admin-page',
  standalone: true,
  imports: [NgClass, RouterLink, ZardButtonComponent, ZardCardComponent, MmTablePaginationComponent],
  templateUrl: './security-admin-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecurityAdminPageComponent {
  private readonly route = inject(ActivatedRoute);
  readonly locale = inject(AppLocaleService);

  readonly pageId = computed(
    () => (this.route.snapshot.data['securityPage'] as SecurityAdminPageId | undefined) ?? 'roles',
  );
  readonly page = computed(() => SECURITY_ADMIN_PAGES[this.pageId()]);
  readonly navLinks = SECURITY_NAV_LINKS;
  readonly pg = createTablePagination(5);
  readonly currentPage = this.pg.currentPage;
  readonly pageSize = this.pg.pageSize;

  readonly tableRows = computed(() => this.page().rows);
  readonly paginatedRows = this.pg.paginated(this.tableRows);
  readonly totalPages = this.pg.totalPages(this.tableRows);
  readonly paginationItems = computed(() => {
    const labels: Record<SecurityAdminPageId, [string, string]> = {
      roles: ['دور', 'roles'],
      roleMatrix: ['وحدة', 'modules'],
      roleScopes: ['نطاق', 'scopes'],
      users: ['مستخدم', 'users'],
      userInvites: ['دعوة', 'invites'],
    };
    const [ar, en] = labels[this.pageId()];
    return this.locale.isRtl() ? ar : en;
  });

  onPageChange(page: number): void {
    this.pg.onPageChange(page, this.totalPages());
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

  linkLabel(link: SecurityNavLink): string {
    return this.t(link.labelAr, link.labelEn);
  }

  linkDescription(link: SecurityNavLink): string {
    return this.t(link.descriptionAr, link.descriptionEn);
  }

  statClass(tone: SecurityTone): string {
    return `${this.toneBorderClass(tone)} ${this.toneSurfaceClass(tone)}`;
  }

  badgeClass(tone: SecurityTone): string {
    return `inline-flex items-center rounded-full border px-2.5 py-1 text-[0.68rem] font-extrabold ${this.toneBadgeClass(tone)}`;
  }

  dotClass(tone: SecurityTone): string {
    return `size-2.5 shrink-0 rounded-full ${this.toneDotClass(tone)}`;
  }

  rowClass(tone: SecurityTone): string {
    return `border-s-4 ${this.toneBorderClass(tone)} hover:bg-emerald-50`;
  }

  textClass(tone: SecurityTone): string {
    return this.toneTextClass(tone);
  }

  cell(row: SecurityTableRow, key: string): string {
    return securityRowCells(row, this.locale.isRtl())[key] ?? '';
  }

  private toneBorderClass(tone: SecurityTone): string {
    const classes: Record<SecurityTone, string> = {
      berry: 'border-emerald-600',
      green: 'border-emerald-500',
      warm: 'border-amber-400',
      red: 'border-rose-500',
      blue: 'border-sky-500',
      slate: 'border-slate-400',
    };

    return classes[tone];
  }

  private toneSurfaceClass(tone: SecurityTone): string {
    const classes: Record<SecurityTone, string> = {
      berry: 'bg-emerald-50',
      green: 'bg-emerald-50',
      warm: 'bg-amber-50',
      red: 'bg-rose-50',
      blue: 'bg-sky-50',
      slate: 'bg-slate-50',
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
